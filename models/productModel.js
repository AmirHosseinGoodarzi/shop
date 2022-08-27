const mongoose = require('mongoose');
const slugify = require('slugify');
const ENUMS = require('../utils/Enums');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'نام محصول نمیتواند خالی باشد'],
    trim: true,
  },
  slug: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    required: [true, 'مشخص کردن نوع کالا الزامی است'],
    enum: {
      values: [ENUMS.PRODUCT_TYPES.DIGITAL, ENUMS.PRODUCT_TYPES.PHISYCAL],
      message: 'نوع کالا شامل مقادیر صحیحی نیست',
    },
  },
  status: {
    type: String,
    required: [true, 'مشخص کردن وضعیت کالا الزامی است'],
    enum: {
      values: [
        ENUMS.PRODUCT_STATUSES.IN_STOCK,
        ENUMS.PRODUCT_STATUSES.WARNING,
        ENUMS.PRODUCT_STATUSES.OUT_OF_STOCK,
      ],
      message: 'وضعیت کالا شامل مقدار صحیحی نیست',
    },
  },
  images: [String],
  price: {
    type: Number,
    required: [true, 'پر کردن فیلد قیمت الزامی است'],
  },
  deliveryCost: {
    type: Number,
    default: 0,
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
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'هر محصول باید دسته بندی مشخص داشته باشد'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  usersBoughtCount: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    required: [true, 'تعداد محصول نمیتواند خالی باشد'],
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { replacement: '_', lower: true });
  next();
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
