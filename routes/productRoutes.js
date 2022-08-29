const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const { USER_PERMISSIONS } = require('../utils/Enums');

const router = express.Router();
router.use(authController.protect);

router
  .route('/')
  .post(
    authController.hasPermission(USER_PERMISSIONS.CREATE_ANY, 'Product'),
    productController.createProduct
  );

router
  .route('/:id')
  .patch(
    authController.hasPermission(USER_PERMISSIONS.UPDATE_ANY, 'Product'),
    productController.updateProduct
  )
  .delete(
    authController.hasPermission(USER_PERMISSIONS.DELETE_ANY, 'Product'),
    productController.deleteProduct
  );

module.exports = router;
