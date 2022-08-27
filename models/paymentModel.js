const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: [true, 'مشخص کردن شناسه سفارش هر پرداختی الزامی است'],
  },
  port: {
    type: String,
    required: [true, 'مشخص کردن درگاه پرداخت برای هر پرداخت الزامی است'],
  },
});

const paymentModel = mongoose.model('Payment', paymentSchema);

module.exports = paymentModel;
