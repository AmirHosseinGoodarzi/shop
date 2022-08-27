const mongoose = require('mongoose');
const ENUMS = require('../utils/Enums');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'مشخص کردن کاربر سفارش دهنده الزامی است'],
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'مشخص کردن محصولات مربوط به این سفارش الزامی است'],
    },
  ],
  price: Number,
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
  finalPrice: Number,
  geoLocation: {
    // GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  status: {
    type: String,
    required: [true, 'مشخص کردن سفارش کالا الزامی است'],
    enum: {
      values: [
        ENUMS.ORDER_STATUSES.WATING_FOR_APPROVEMENT,
        ENUMS.ORDER_STATUSES.APPROVED,
        ENUMS.ORDER_STATUSES.DECLINED,
        ENUMS.ORDER_STATUSES.IN_PROGRESS,
        ENUMS.ORDER_STATUSES.DELIVERING,
        ENUMS.ORDER_STATUSES.DELIVERED,
      ],
      message: 'وضعیت سفارش شامل مقدار صحیحی نیست',
    },
    default: ENUMS.ORDER_STATUSES.WATING_FOR_APPROVEMENT,
  },
});

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
