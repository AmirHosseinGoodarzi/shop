const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

exports.loginSignup = catchAsync(async (req, res, next) => {
  const { mobile } = req.body;
  // 1) Check if mobile exist
  if (!mobile) {
    return next(new AppError('مقادیر شماره موبایل نمینواند خالی باشد', 400));
  }
  // 2) Check if user exists login else signup
  try {
    let user = await User.findOne({ mobile });
    if (!user) user = await User.create({ mobile });
    const otp = await user.generateOtpCode();
    if (otp) {
      // send this otp by sms
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
  const user = await User.findOne({ mobile }).select('+otpCode');

  if (
    !(await user.otpCodeIsCorrect(otpCode, user.otpCode, user.otpCodeExpires))
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
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
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
