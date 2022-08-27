const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  resource: {
    type: mongoose.Schema.ObjectId,
    ref: 'Resource',
    required: [true, 'هر محصول باید منبع مشخص داشته باشد'],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'هر محصول باید دسته بندی مشخص داشته باشد'],
  },
  name: {
    type: String,
    required: [true, 'نام محصول نمیتواند خالی باشد'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'پر کردن فیلد قیمت الزامی است'],
  },
  discountPercent: {
    type: Number,
    validate: {
      validator: function (val) {
        // this only points to current doc on NEW document creation
        return val < 100 || val > 0;
      },
      message: 'مقادیر تخفیف باید بین 0 تا 100 درصد باشد',
    },
  },
  images: [String],
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
