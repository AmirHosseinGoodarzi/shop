const Product = require('../models/productModel');
const factory = require('./handlerFactory');

exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
