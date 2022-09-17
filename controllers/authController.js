const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AccessControl = require('accesscontrol');
const crypto = require('crypto');
const accessControlGrants = require('../utils/misc/accessControlGrants.json');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { USER_PERMISSIONS } = require('../utils/Enums');
const { getDateTime } = require('../utils/persianDate');

const ac = new AccessControl(accessControlGrants);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove otpCode from output
  user.otpCode = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.EmailLoginSignup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(
      new AppError('مقادیر ورودی ایمیل یا پسورد نمینوانند خالی باشد', 400)
    );
  }
  // 2) Check if user exists login else signup
  try {
    // 2-1) Check if user exists && password is correct
    let user = await User.findOne({ email }).select('+password');
    if (user) {
      if (!(await user.comparePasswords(password, user.password))) {
        return next(
          new AppError(
            'رمز عبور وارد شده اشتباه است\nدرصورتی که رمز خود را فراموش کرده‌اید میتوانید از بخش فراموشی رمز عبور نسبت به بازگردانی آن اقدام نمایید.',
            401
          )
        );
      }
    } else {
      // 2-2) user not exist , then signUp him
      user = await User.create({ email, password });
    }
    // 3) If everything ok, send token to client
    createSendToken(user, 201, req, res);
  } catch (err) {
    return next(new AppError('خطا در ورود! لطفا دوباره تلاش کنید', 500));
  }
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email }).select(
    '+passwordResetExpires'
  );
  if (!user) {
    return next(new AppError('کاربری با این آدرس ایمیل یافت نشد', 404));
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  try {
    if (resetToken) {
      await user.save({ validateBeforeSave: false });
      // 3) Send it to user's email
      const resetURL = `${req.protocol}://site.com/resetPassword/${resetToken}`;
      const { jDate: jalaliExpireDate, jTime: jalaliExpireTime } = getDateTime(
        user.passwordResetExpires
      );
      console.log(
        `فراموشی رمز عبور:\nurl: ${resetURL}\nزمان اعتبار: ${jalaliExpireDate} - ${jalaliExpireTime}`
      );
      // await new Email(user, resetURL).sendPasswordReset();
      res.status(200).json({
        status: 'success',
        message: 'ایمیل فراموشی رمز برای شما ارسال گردید',
      });
    } else {
      return next(
        new AppError(
          'ارسال ایمیل فراموشی رمز هر 5 دقیقه یکبار امکان پذیر است',
          403
        )
      );
    }
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'خطایی در هنگام ارسال ایمیل فراموشی رخ داده است. لطفا مجددا سعی نمایید'
      ),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(
      new AppError('توکن بازگردانی رمز عبور نامعتبر و یا منقضی شده است', 400)
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  // 2) Check if POSTed current password is correct
  if (!(await user.comparePasswords(req.body.passwordCurrent, user.password))) {
    return next(new AppError('رمز عبور فعلی اشتباه است', 401));
  }
  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!
  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.MobileLoginSignup = catchAsync(async (req, res, next) => {
  const { mobile } = req.body;
  // 1) Check if mobile exist
  if (!mobile) {
    return next(new AppError('مقادیر شماره موبایل نمینواند خالی باشد', 400));
  }
  // 2) Check if user exists login else signup
  try {
    let user = await User.findOne({ mobile }).select('+otpCodeExpires');
    if (!user) user = await User.create({ mobile });
    const otp = await user.generateOtpCode();
    if (otp) {
      // send this otp by sms
      const { jDate: jalaliExpireDate, jTime: jalaliExpireTime } = getDateTime(
        user.otpCodeExpires
      );
      console.log(
        `کد ورود به سامانه:\nCode: ${otp}\nزمان اعتبار: ${jalaliExpireDate} - ${jalaliExpireTime}`
      );
      await user.save({ validateBeforeSave: false });
      res.status(200).json({
        status: 'success',
        message: 'کد اعتبار سنجی یکبار مصرف برای شماره موبایل شما ارسال شد',
      });
    } else {
      return next(
        new AppError(
          'ارسال کد اعتبار سنجی هر 2 دقیقه یکبار امکان پذیر است',
          403
        )
      );
    }
  } catch (err) {
    return next(new AppError('خطا در ارسال پیامک! لطفا دوباره تلاش کنید', 500));
  }
});

exports.checkOtpCode = catchAsync(async (req, res, next) => {
  const { mobile, otpCode } = req.body;

  // 1) Check if mobile and otpCode exist
  if (!mobile || !otpCode) {
    return next(
      new AppError('مقادیر شماره موبایل و کد اعتبار سنجی الزامی هستند', 400)
    );
  }

  // 2) Check if user exists && otpCode is correct
  const user = await User.findOne({ mobile }).select(
    '+otpCode +otpCodeExpires'
  );
  if (
    !(await user.compareOtpCodes(otpCode, user.otpCode, user.otpCodeExpires))
  ) {
    return next(
      new AppError('کد اعتبار سنجی وارد شده منقضی شده یا اشتباه است', 401)
    );
  }
  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    // eslint-disable-next-line operator-linebreak
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        'توکن احراز هویت شما نامعتبر است::برای دسترسی به این بخش ابتدا باید وارد حساب کاربری خود شوید',
        401
      )
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('کاربری با این مشخصات یافت نشد', 401));
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'رمز عبور این حساب کاربری اخیرا تغیر یافته است\nلطفا دوباره وارد شوید',
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new AppError(
//           'حساب کاربری شما اجازه و سطح دسترسی به این بخش را ندارد',
//           403
//         )
//       );
//     }
//     next();
//   };
// };
exports.hasPermission = (action, asset) => {
  return (req, res, next) => {
    let permission;
    switch (action) {
      case USER_PERMISSIONS.CREATE_ANY:
        permission = ac.can(req.user.role).createAny(asset);
        break;
      case USER_PERMISSIONS.READ_ANY:
        permission = ac.can(req.user.role).readAny(asset);
        break;
      case USER_PERMISSIONS.UPDATE_ANY:
        permission = ac.can(req.user.role).updateAny(asset);
        break;
      case USER_PERMISSIONS.DELETE_ANY:
        permission = ac.can(req.user.role).deleteAny(asset);
        break;
      case USER_PERMISSIONS.CREATE_OWN:
        permission = ac.can(req.user.role).createOwn(asset);
        break;
      case USER_PERMISSIONS.READ_OWN:
        permission = ac.can(req.user.role).readOwn(asset);
        break;
      case USER_PERMISSIONS.UPDATE_OWN:
        permission = ac.can(req.user.role).updateOwn(asset);
        break;
      case USER_PERMISSIONS.DELETE_OWN:
        permission = ac.can(req.user.role).deleteOwn(asset);
        break;
      default:
        break;
    }
    if (!permission.granted) {
      return next(
        new AppError(
          'حساب کاربری شما اجازه و سطح دسترسی به این بخش را ندارد',
          403
        )
      );
    }
    next();
  };
};
