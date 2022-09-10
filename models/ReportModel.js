const mongoose = require('mongoose');
const slugify = require('slugify');

const reportSchema = new mongoose.Schema({
  Product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'مشخص کردن محصول برای ثبت گزارش الزامی است'],
  },
  description: {
    type: String,
    required: [true, 'توضیحات گزارش نمیتواند خالی باشد'],
  },
});

reportSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { replacement: '_', lower: true });
  next();
});

const reportModel = mongoose.model('Report', reportSchema);

module.exports = reportModel;
