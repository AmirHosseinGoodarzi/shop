const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { USER_PERMISSIONS } = require('../utils/Enums');

const router = express.Router();

router.post('/loginSignup', authController.loginSignup);

router.post('/checkOtpCode', authController.checkOtpCode);

router.get('/logout', authController.logout);

router.use(authController.protect);

router
  .route('/:id')
  .get(
    authController.hasPermission(USER_PERMISSIONS.READ_ANY, 'User'),
    userController.getUser
  )
  .patch(
    authController.hasPermission(USER_PERMISSIONS.UPDATE_ANY, 'User'),
    userController.updateUser
  );

router
  .route('/:id')
  .delete(
    authController.hasPermission(USER_PERMISSIONS.DELETE_ANY, 'User'),
    userController.banUser
  );

module.exports = router;
