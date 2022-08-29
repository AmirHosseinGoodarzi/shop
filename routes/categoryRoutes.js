const express = require('express');

const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const { USER_PERMISSIONS } = require('../utils/Enums');

const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .post(
    authController.hasPermission(USER_PERMISSIONS.CREATE_ANY, 'Category'),
    categoryController.createCategory
  )
  .get(
    authController.hasPermission(USER_PERMISSIONS.READ_ANY, 'Category'),
    categoryController.getAllCategories
  );

router
  .route('/:id')
  .patch(
    authController.hasPermission(USER_PERMISSIONS.UPDATE_ANY, 'Category'),
    categoryController.updateCategory
  )
  .delete(
    authController.hasPermission(USER_PERMISSIONS.DELETE_ANY, 'Category'),
    categoryController.deleteCategory
  );

module.exports = router;
