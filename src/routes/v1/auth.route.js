const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');

const router = express.Router();
/**
 * @swagger
 * definitions:
 *   Student:
 *     required:
 *       - name
 *       - email
 *       - password
 *       - pic
 *     properties:
 *       name:
 *         type: string
 *         example: xyz
 *       email:
 *         type: string
 *         example: xyz@domain.com
 *       password:
 *         type: string
 *         example: test@123
 *       pic:
 *         type: string
 *         example: https://www.xyz.com/abc.jpg
 */

/**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     tags:
 *       - "Auth"
 *     description: Register as student
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Student object.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/Student"
 *     responses:
 *       201:
 *         description: successfull operation
 */

router.post('/register', validate(authValidation.register), authController.register);

/**
 * @swagger
 * definitions:
 *   Login:
 *     required:
 *       - email
 *       - password
 *       - device_token
 *       - device_type
 *     properties:
 *       email:
 *         type: string
 *         example: xyz@domain.com
 *       password:
 *         type: string
 *         example: Test@123
 *       device_token:
 *         type: string
 *         example: your token
 *       device_type:
 *         type: string
 *         enum: [ios, android]
 */

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     tags:
 *       - "Auth"
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Email and password for login.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/Login"
 *     responses:
 *       200:
 *         description: login
 */
router.post('/login', validate(authValidation.login), authController.login);

router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

/**
 * @swagger
 * definitions:
 *   Forgot-Password:
 *     required:
 *       - email
 *     properties:
 *       email:
 *         type: string
 *         example: xyz@domain.com
 */

/**
 * @swagger
 *
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - "Auth"
 *     description: Pass valid email address of existing user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Forgot password.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/Forgot-Password"
 *     responses:
 *       204:
 *         description: successful operation
 */
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
/**
 * @swagger
 * definitions:
 *   Reset-Password:
 *     required:
 *       - password
 *     properties:
 *       password:
 *         type: string
 *         example: newpass@123
 */

/**
 * @swagger
 *
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - "Auth"
 *     description: Pass valid email address of existing user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: Token.
 *         in: query
 *         required: true
 *         type: string
 *       - name: body
 *         description: New password.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/Reset-Password"
 *     responses:
 *       204:
 *         description: successful operation
 */
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);


/**
 * @swagger
 * definitions:
 *   Logout:
 *     required:
 *       - device_type
 *     properties:
 *       device_type:
 *         type: string
 *         enum: [ios, android]
 */

/**
 * @swagger
 *
 * /auth/logout:
 *   post:
 *     tags:
 *       - "Auth"
 *     description: Logout from application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Logout.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/Logout"
*     security:
 *      - Bearer: []
 *     responses:
 *       200:
 *         description: Logout
 */
router.post('/logout', auth('profile'), validate(authValidation.logout), authController.logout);

module.exports = router;
