const User = require('../models/userModel');
const factory = require('./handlerFactory');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.banUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(
    req.params.id,
    { active: false },
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
