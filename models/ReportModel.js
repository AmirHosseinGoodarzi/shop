const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'مشخص کردن محصول برای ثبت گزارش الزامی است'],
  },
  description: {
    type: String,
    required: [true, 'توضیحات گزارش نمیتواند خالی باشد'],
  },
});

categorySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { replacement: '_', lower: true });
  next();
});

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;
