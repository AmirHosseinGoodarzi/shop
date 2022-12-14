const mongoose = require('mongoose');

const discountCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'پر کردن فیلد نام دسته بندی الزامی است'],
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'پر کردن فیلد کد تخفیف الزامی است'],
    trim: true,
  },
  percent: {
    type: Number,
    // required: [true, 'تعیین میزان تخفیف برای هر کد الزامی است'],
  },
  minPurchase: {
    type: Number,
  },
  // or
  amount: {
    type: Number,
    // required: [true, 'تعیین مبلغ تخفیف برای هر کد الزامی است'],
  },
  User: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    // required: [true, 'مشخص کردن کاربر استفاده کننده از کد تخفیف الزامی است'],
  },
});

const discountCodeModel = mongoose.model('DiscountCode', discountCodeSchema);

module.exports = discountCodeModel;
