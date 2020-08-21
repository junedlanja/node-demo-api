const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const eventValidation = require('../../validations/event.validation');
const eventController = require('../../controllers/event.controller');


const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Event:
 *     required:
 *       - name
 *       - info
 *       - location
 *       - startDate
 *       - endDate
 *     properties:
 *       name:
 *         type: string
 *         example: Some Event
 *       info:
 *         type: string
 *         example: Some event information test
 *       location:
 *         type: string
 *         example: Some Address, City Pincode
 *       startDate:
 *         type: string
 *         format: date-time
 *       endDate:
 *         type: string
 *         format: date-time
 */

/**
 * @swagger
 *
 * /events:
 *   post:
 *     tags:
 *       - "Events"
 *     description: Create event
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Event object.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/Event"
 *     security:
 *      - Bearer: []
 *     responses:
 *       201:
 *         description: successfull operation
 */
router.route('/').post(auth('manageEvents'), validate(eventValidation.createEvent), eventController.createEvent)

/**
 * @swagger
 *
 * /events:
 *   get:
 *     tags:
 *       - "Events"
 *     description: Get events
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: search
 *         description: Search by name/info/location.
 *         in: query
 *         required: false
 *         type: string
 *       - name: status
 *         description: Filter by status.
 *         in: query
 *         required: false
 *         type: number
 *       - name: fromDate
 *         description: Filter by fromDate.
 *         in: query
 *         required: false
 *         type: string
 *         format: date-time
 *       - name: toDate
 *         description: Filter by toDate.
 *         in: query
 *         required: false
 *         type: string
 *         format: date-time
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
router.route('/').get(auth('getEvents'), validate(eventValidation.getEvents), eventController.getEvents)

/**
 * @swagger
 *
 * /events/{eventId}:
 *   get:
 *     tags:
 *       - "Events"
 *     description: Get event
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: eventId
 *         description: Id of event that needs to be fetched.
 *         in: path
 *         required: true
 *         type: "string"
 *     responses:
 *       200:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:eventId').get(auth('getEvents'), validate(eventValidation.getEvent), eventController.getEvent)

/**
 * @swagger
 *
 * /events/{eventId}:
 *   patch:
 *     tags:
 *       - "Events"
 *     description: Update event
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: eventId
 *         description: Id of event that needs to be fetched.
 *         in: path
 *         required: true
 *         type: string
 *       - name: body
 *         description: Event object.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/Event"
 *     responses:
 *       201:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:eventId').patch(auth('manageEvents'), validate(eventValidation.updateEvent), eventValidation.checkEventOwner, eventController.updateEvent)

/**
 * @swagger
 *
 * /events/{eventId}:
 *   delete:
 *     tags:
 *       - "Events"
 *     description: Delete event
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: eventId
 *         description: Id of event that needs to be fetched.
 *         in: path
 *         required: true
 *         type: "string"
 *     responses:
 *       201:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:eventId').delete(auth('manageEvents'), validate(eventValidation.deleteEvent), eventValidation.checkEventOwner, eventController.deleteEvent)

/**
 * @swagger
 *
 * /events/{eventId}/enable:
 *   patch:
 *     tags:
 *       - "Events"
 *     description: Enable event
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: eventId
 *         description: Id of event that needs to be enabled.
 *         in: path
 *         required: true
 *         type: "string"
 *     responses:
 *       201:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:eventId/enable').patch(auth('manageEvents'), validate(eventValidation.getEvent), eventController.enableEvent)

/**
 * @swagger
 *
 * /events/{eventId}/disable:
 *   patch:
 *     tags:
 *       - "Events"
 *     description: Disable event
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: eventId
 *         description: Id of event that needs to be disabled.
 *         in: path
 *         required: true
 *         type: "string"
 *     responses:
 *       201:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:eventId/disable').patch(auth('manageEvents'), validate(eventValidation.getEvent), eventController.disableEvent)

/**
 * @swagger
 *
 * /events/{eventId}/rsvp-accept:
 *   patch:
 *     tags:
 *       - "Events"
 *     description: Positive rsvp for an event
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: eventId
 *         description: Id of event.
 *         in: path
 *         required: true
 *         type: "string"
 *     responses:
 *       201:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:eventId/rsvp-accept').patch(auth('manageRSVP'), validate(eventValidation.getEvent), eventController.acceptRSVP)

/**
 * @swagger
 *
 * /events/{eventId}/rsvp-reject:
 *   patch:
 *     tags:
 *       - "Events"
 *     description: Positive rsvp for an event
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: eventId
 *         description: Id of event.
 *         in: path
 *         required: true
 *         type: "string"
 *     responses:
 *       201:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:eventId/rsvp-reject').patch(auth('manageRSVP'), validate(eventValidation.getEvent), eventController.rejectRSVP)

/**
 * @swagger
 * definitions:
 *   Notification:
 *     required:
 *       - title
 *       - message
 *     properties:
 *       title:
 *         type: string
 *         example: Some title
 *       message:
 *         type: string
 *         example: Some message
 */
/**
 * @swagger
 *
 * /events/{eventId}/send-notification:
 *   post:
 *     tags:
 *       - "Events"
 *     description: Send notification
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: eventId
 *         description: Id of event.
 *         in: path
 *         required: true
 *         type: "string"
 *       - name: body
 *         description: Notification object.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/Notification"
 *     responses:
 *       201:
 *         description: successfull operation
 *     security:
 *      - Bearer: []
 */
router.route('/:eventId/send-notification').post(auth('sendNotification'), validate(eventValidation.sendNotification), eventController.sendNotification)



module.exports = router;
