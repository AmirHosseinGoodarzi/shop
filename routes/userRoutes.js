const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const ENUMS = require('../utils/Enums');

const router = express.Router();
/**
 * @swagger
 * /loginSignup:
 *   post:
 *     summary: login user and if it does`nt exist signup him
 *     tags:
 *        - User
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mobile:
 *                   type: string
 *                   example: "09056325077"
 */
router.post('/loginSignup', authController.loginSignup);
/**
 * @swagger
 * /checkOtpCode:
 *   post:
 *     summary: authenticate user otpcode  after login or signUp
 *     tags:
 *        - User
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mobile:
 *                   type: string
 *                   example: "09056325077"
 *                 otpCode:
 *                   type: string
 *                   example: "12345"
 */
router.post('/checkOtpCode', authController.checkOtpCode);
/**
 * @swagger
 * /logout:
 *   get:
 *     summary: remove user jwt http cookie
 *     tags:
 *        - Category
 */
router.get('/logout', authController.logout);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: getAllUsers (only ADMIN role)
 *     tags:
 *        - User
 */
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo(ENUMS.USER_ROLES.ADMIN),
    userController.getAllUsers
  );
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: getUserById (only ADMIN role)
 *     tags:
 *        - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: user Unique Id
 *         schema:
 *           type: integer
 */
/**
 * @swagger
 * /users:
 *   patch:
 *     summary: updateUser
 *     tags:
 *        - User
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "62dc4baf59cd222a200cc21b"
 */
/**
 * @swagger
 * /users:
 *   delete:
 *     summary: deleteUserById (only ADMIN role)
 *     tags:
 *        - User
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "62dc4baf59cd222a200cc21b"
 */
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
