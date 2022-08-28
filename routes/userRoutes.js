const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const ENUMS = require('../utils/Enums');

const router = express.Router();

router.post('/loginSignup', authController.loginSignup);

router.post('/checkOtpCode', authController.checkOtpCode);

router.get('/logout', authController.logout);

router.use(authController.protect);
router.use(authController.restrictTo(ENUMS.USER_ROLES.ADMIN));

router.route('/').get(authController.protect, userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
