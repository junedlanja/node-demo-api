const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/response');
const Messages = require('../utils/messages');
const { eventService } = require('../services');

const createEvent = catchAsync(async (req, res) => {
    req.body.createdBy = req.user._id;
    const event = await eventService.createEvent(req.body);
    createResponse(res, httpStatus.CREATED, Messages.EVENT_CREATED, { event })
});

const getEvents = catchAsync(async (req, res) => {
    const events = await eventService.getEvents(req.query);
    createResponse(res, httpStatus.OK, Messages.EVENT_LIST, { events })
});

const getEvent = catchAsync(async (req, res) => {
    const event = await eventService.getEventById(req.params.eventId);
    createResponse(res, httpStatus.OK, Messages.EVENT_FETCHED, { event })
});

const updateEvent = catchAsync(async (req, res) => {
    const event = await eventService.updateEvent(req.params.eventId, req.body);
    createResponse(res, httpStatus.OK, Messages.EVENT_UPDATED, { event })
});

const deleteEvent = catchAsync(async (req, res) => {
    await eventService.deleteEvent(req.params.eventId);
    createResponse(res, httpStatus.OK, Messages.EVENT_DELETED, { eventId: req.params.eventId })
});

const enableEvent = catchAsync(async (req, res) => {
    const event = await eventService.updateEvent(req.params.eventId, { status: 1 });
    createResponse(res, httpStatus.OK, Messages.EVENT_ENABLED, { event })
});

const disableEvent = catchAsync(async (req, res) => {
    const event = await eventService.updateEvent(req.params.eventId, { status: 0 });
    createResponse(res, httpStatus.OK, Messages.EVENT_DISABLED, { event })
});

const acceptRSVP = catchAsync(async (req, res) => {
    const event = await eventService.acceptRSVP(req.params.eventId, req.user._id);
    createResponse(res, httpStatus.OK, Messages.EVENT_RSVP_ACCEPT, { event })
});

const rejectRSVP = catchAsync(async (req, res) => {
    const event = await eventService.rejectRSVP(req.params.eventId, req.user._id);
    createResponse(res, httpStatus.OK, Messages.EVENT_RSVP_REJECT, { event })
});

const sendNotification = catchAsync(async (req, res) => {
    await eventService.sendNotification(req.params.eventId, req.body.title, req.body.message)
    createResponse(res, httpStatus.OK, Messages.NOTIFCATION_SENT, {})
});

module.exports = {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    enableEvent,
    disableEvent,
    acceptRSVP,
    rejectRSVP,
    sendNotification
};
