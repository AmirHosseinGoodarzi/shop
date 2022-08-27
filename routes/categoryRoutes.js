const express = require('express');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const ENUMS = require('../utils/Enums');

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: getAllCategories
 *     tags:
 *        - Category
 */
router.use(authController.protect);
router.route('/').get(categoryController.getAllCategories);

// only admins can access these routes after this middleware
router.use(authController.restrictTo(ENUMS.USER_ROLES.ADMIN));
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: createCategory (only ADMIN role)
 *     tags:
 *        - Category
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "هایپر استار"
 *                 imageCover:
 *                   type: string
 *                   example: "address"
 */
router.route('/').post(categoryController.createCategory);
/**
 * @swagger
 * /categories:
 *   patch:
 *     summary: updateCategory (only ADMIN role)
 *     tags:
 *        - Category
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "هایپر استار"
 *                 imageCover:
 *                   type: string
 *                   example: "address"
 */
/**
 * @swagger
 * /categories:
 *   delete:
 *     summary: deleteCategoryById (only ADMIN role)
 *     tags:
 *        - Category
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
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
