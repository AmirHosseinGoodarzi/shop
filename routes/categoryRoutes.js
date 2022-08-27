const express = require('express');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const ENUMS = require('../utils/Enums');

const router = express.Router();

router.use(authController.protect);
router.route('/').get(categoryController.getAllCategories);
router.use(
  authController.restrictTo(
    ENUMS.USER_ROLES.ADMIN,
    ENUMS.USER_ROLES.PRODUCT_MANAGER
  )
);
// createCategory
router.route('/').post(categoryController.createCategory);
// updateCategory
// deleteCategory
router
  .route('/:id')
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
