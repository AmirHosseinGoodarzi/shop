const mongoose = require('mongoose');
const slugify = require('slugify');

const commentSchema = new mongoose.Schema({
  Product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'مشخص کردن محصولِ مربوط به این نظر الزامی است'],
  },
  User: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'مشخص کردن کاربر نظر دهنده الزامی است'],
  },
  hasBought: Boolean,
  text: {
    type: String,
    required: [true, 'متن مورد استفاده در نظرات نمیتواند خالی باشد'],
  },
  isApproved: Boolean,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

commentSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { replacement: '_', lower: true });
  next();
});

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;
