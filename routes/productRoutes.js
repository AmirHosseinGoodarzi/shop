const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const ENUMS = require('../utils/Enums');

const router = express.Router();
/**
 * @swagger
 * /products:
 *   post:
 *     summary: createProduct
 *     tags:
 *        - Product
 */
router.route('/').post(authController.protect, productController.createProduct);
/**
 * @swagger
 * /products:
 *   patch:
 *     summary: updateProduct (only ADMIN role)
 *     tags:
 *        - Product
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
 * /products:
 *   delete:
 *     summary: deleteProductById (only ADMIN role)
 *     tags:
 *        - Product
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
  .patch(
    authController.protect,
    authController.restrictTo(ENUMS.USER_ROLES.ADMIN),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo(ENUMS.USER_ROLES.ADMIN),
    productController.deleteProduct
  );

module.exports = router;
