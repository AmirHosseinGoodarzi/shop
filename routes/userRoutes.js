const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { USER_PERMISSIONS } = require('../utils/Enums');

const router = express.Router();

router.post('/EmailLoginSignup', authController.EmailLoginSignup);
router.post('/MobileLoginSignup', authController.MobileLoginSignup);
router.post('/checkOtpCode', authController.checkOtpCode);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.patch(
  '/updateMyPassword',
  authController.hasPermission(USER_PERMISSIONS.UPDATE_OWN, 'User'),
  authController.updatePassword
);
router.get(
  '/me',
  authController.hasPermission(USER_PERMISSIONS.READ_OWN, 'User'),
  userController.getMe,
  userController.getUser
);
router.patch(
  '/updateMe',
  authController.hasPermission(USER_PERMISSIONS.UPDATE_OWN, 'User'),
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete(
  '/banUser',
  authController.hasPermission(USER_PERMISSIONS.DELETE_ANY, 'User'),
  userController.banUser
);
router.post(
  '/unBanUser',
  authController.hasPermission(USER_PERMISSIONS.READ_ANY, 'User'),
  userController.unBanUser
);
router
  .route('/')
  .get(
    authController.hasPermission(USER_PERMISSIONS.READ_ANY, 'User'),
    userController.getAllUsers
  );
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

module.exports = router;
