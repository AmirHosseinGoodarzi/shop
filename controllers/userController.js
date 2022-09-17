const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('فایل نامعتبر! لطفا فقط تصویر آپلود نمایید', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'این مسیر برای به روز رسانی رمز عبور استفاده نمیشود، برا تغییر رمز عبور از مسیر /updateMyPassword استفاده نمایید',
        400
      )
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'name',
    'family',
    'email',
    'nationalCode'
  );
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.banUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(
    req.params.id,
    {
      active: false,
      banReason: req.body.banReason
        ? req.body.banReason
        : 'عدم تعیین علت مسدودی توسط ادمین',
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!doc) {
    return next(new AppError('سندی با این شناسه یافت نشد', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'کاربر مورد نظر مسدود گردید',
    data: null,
  });
});
exports.unBanUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(
    req.params.id,
    { active: true, $unset: { banReason: '' } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!doc) {
    return next(new AppError('سندی با این شناسه یافت نشد', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'حساب کاربر مورد نظر از حالت مسدود خارج شد',
    data: null,
  });
});
