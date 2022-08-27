const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const ENUMS = require('../utils/Enums');

const router = express.Router();
router.use(authController.protect);
router.use(
  authController.restrictTo(
    ENUMS.USER_ROLES.ADMIN,
    ENUMS.USER_ROLES.PRODUCT_MANAGER
  )
);
// createProduct
router.route('/').post(productController.createProduct);
// updateProduct
// deleteProduct
router
  .route('/:id')
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
