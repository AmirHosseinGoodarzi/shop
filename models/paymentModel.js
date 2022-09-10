const mongoose = require('mongoose');
const ENUMS = require('../utils/Enums');

const paymentSchema = new mongoose.Schema({
  Order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: [true, 'مشخص کردن شناسه سفارش هر پرداختی الزامی است'],
  },
  port: {
    type: String,
    required: [true, 'مشخص کردن درگاه پرداخت برای هر پرداخت الزامی است'],
    enum: {
      values: [ENUMS.PAYMENT_PORTS.MELLAT, ENUMS.PAYMENT_PORTS.MELLAT],
      message: 'وضعیت کالا شامل مقدار صحیحی نیست',
    },
  },
});

const paymentModel = mongoose.model('Payment', paymentSchema);

module.exports = paymentModel;
