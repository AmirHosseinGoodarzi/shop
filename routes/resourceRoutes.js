const express = require('express');
const resourceController = require('../controllers/resourceController');
const authController = require('../controllers/authController');

const router = express.Router();
/**
 * @swagger
 * /resources:
 *   get:
 *     summary: getAllResources
 *     tags:
 *        - Resource
 */
router
  .route('/')
  .get(authController.protect, resourceController.getAllResources);

module.exports = router;
