const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const ENUMS = require('../utils/Enums');

const router = express.Router();

router.post('/loginSignup', authController.loginSignup);

router.post('/checkOtpCode', authController.checkOtpCode);

router.get('/logout', authController.logout);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo(ENUMS.USER_ROLES.ADMIN),
    userController.getAllUsers
  );
router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo(ENUMS.USER_ROLES.ADMIN),
    userController.getUser
  )
  .patch(authController.protect, userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo(ENUMS.USER_ROLES.ADMIN),
    userController.deleteUser
  );
module.exports = router;
