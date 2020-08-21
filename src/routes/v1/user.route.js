const express = require('express');
const upload = require('../../config/multer')
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   User:
 *     required:
 *       - name
 *       - email
 *       - password
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
 */

/**
 * @swagger
 *
 * /users:
 *   post:
 *     tags:
 *       - "Users"
 *     description: Create user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: User object.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/User"
 *     security:
 *      - Bearer: []
 *     responses:
 *       201:
 *         description: successfull operation
 */
router.route('/').post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)

/**
 * @swagger
 *
 * /users:
 *   get:
 *     tags:
 *       - "Users"
 *     description: Get users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: search
 *         description: Search by name/email.
 *         in: query
 *         required: false
 *         type: string
 *       - name: status
 *         description: Filter by status.
 *         in: query
 *         required: false
 *         type: number
 *       - name: role
 *         description: Filter by role.
 *         in: query
 *         required: false
 *         type: string
 *       - name: page
 *         description: Page number.
 *         in: query
 *         required: false
 *         type: integer
 *       - name: limit
 *         description: Item per page.
 *         in: query
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/').get(auth('manageUsers'), validate(userValidation.getUsers), userController.getUsers)

/**
 * @swagger
 *
 * /users/{userId}:
 *   get:
 *     tags:
 *       - "Users"
 *     description: Get user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: Id of user that needs to be fetched.
 *         in: path
 *         required: true
 *         type: "string"
 *     responses:
 *       200:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:userId').get(auth('manageUsers'), validate(userValidation.getUser), userController.getUser)

/**
 * @swagger
 *
 * /users/{userId}:
 *   patch:
 *     tags:
 *       - "Users"
 *     description: Update user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: Id of user that needs to be fetched.
 *         in: path
 *         required: true
 *         type: string
 *       - name: body
 *         description: User object.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/User"
 *     responses:
 *       201:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:userId').patch(auth('profile'), validate(userValidation.updateUser), userController.updateUser)

/**
 * @swagger
 *
 * /users/{userId}:
 *   delete:
 *     tags:
 *       - "Users"
 *     description: Delete user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: Id of user that needs to be fetched.
 *         in: path
 *         required: true
 *         type: "string"
 *     responses:
 *       201:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:userId').delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser)

/**
 * @swagger
 *
 * /users/{userId}/enable:
 *   patch:
 *     tags:
 *       - "Users"
 *     description: Enable user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: Id of user that needs to be enabled.
 *         in: path
 *         required: true
 *         type: "string"
 *     responses:
 *       201:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:userId/enable').patch(auth('manageUsers'), validate(userValidation.getUser), userController.enableUser)

/**
 * @swagger
 *
 * /users/{userId}/disable:
 *   patch:
 *     tags:
 *       - "Users"
 *     description: Diable user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: Id of user that needs to be disabled.
 *         in: path
 *         required: true
 *         type: "string"
 *     responses:
 *       201:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:userId/disable').patch(auth('manageUsers'), validate(userValidation.getUser), userController.disableUser)

/**
 * @swagger
 * definitions:
 *   AssignRole:
 *     required:
 *       - role
 *     properties:
 *       role:
 *         type: string
 *         enum: [user, staff]
 */

/**
 * @swagger
 *
 * /users/{userId}/assign-role:
 *   patch:
 *     tags:
 *       - "Users"
 *     description: Assign user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: Id of user that needs to be enabled.
 *         in: path
 *         required: true
 *         type: "string"
 *       - name: body
 *         description: User role.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/AssignRole"
 *     responses:
 *       201:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:userId/assign-role').patch(auth('assignRole'), validate(userValidation.assignRole), userController.assignRole)

/**
 * @swagger
 * definitions:
 *   ChangePassword:
 *     required:
 *       - oldPassword
 *       - password
 *     properties:
 *       oldPassword:
 *         type: string
 *         example: oldpass@123
 *       password:
 *         type: string
 *         example: newpass@123
 */

/**
 * @swagger
 *
 * /users/{userId}/change-password:
 *   patch:
 *     tags:
 *       - "Users"
 *     description: Change password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: Id of user
 *         in: path
 *         required: true
 *         type: string
 *       - name: body
 *         description: oldPassword/password.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/ChangePassword"
 *     responses:
 *       201:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:userId/change-password').patch(auth('profile'), validate(userValidation.changePassword), userController.changePassword)

/**
 * @swagger
 *
 * /users/{userId}/change-profile-pic:
 *   patch:
 *     tags:
 *       - "Users"
 *     description: Change profile pic
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: Id of user
 *         in: path
 *         required: true
 *         type: string
 *       - name: pic
 *         description: Profile pic to upload
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
 *       201:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:userId/change-profile-pic').patch(auth('profile'), upload.single('pic'), userController.changeProfilePic)

module.exports = router;
