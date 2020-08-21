const Joi = require('@hapi/joi');
const httpStatus = require('http-status');

const AppError = require('./../utils/AppError');
const Messages = require('./../utils/messages');
const { objectId } = require('./custom.validation');
const { eventService } = require('./../services');

const createEvent = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        info: Joi.string().required(),
        location: Joi.string().required(),
        startDate: Joi.date().iso().greater(new Date().toISOString().slice(0,10)).required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required()
    }),
};

const getEvents = {
    query: Joi.object().keys({
        search: Joi.string(),
        status: Joi.number().integer(),
        fromDate: Joi.date().iso(),
        toDate: Joi.date().iso(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getEvent = {
    params: Joi.object().keys({
        eventId: Joi.string().custom(objectId),
    }),
};

const updateEvent = {
    params: Joi.object().keys({
        eventId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            info: Joi.string(),
            location: Joi.string(),
            startDate: Joi.date().iso(),
            endDate: Joi.date().iso().greater(Joi.ref('startDate'))
        })
        .min(1),
};

const deleteEvent = {
    params: Joi.object().keys({
        eventId: Joi.string().custom(objectId),
    }),
};

const checkEventOwner = async (req, res, next) => {
    const { _id, role } = req.user;
    const { eventId } = req.params;
    if (role === 'admin')
        return next()
    const isUserEvent = await eventService.checkEventOwner(eventId, _id)
    if (isUserEvent)
        next();
    else
        next(new AppError(httpStatus.FORBIDDEN, 'Forbidden'));
}

const sendNotification = {
    params: Joi.object().keys({
        eventId: Joi.string().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            title: Joi.string().required(),
            message: Joi.string().required(),
        }),
};

module.exports = {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    checkEventOwner,
    sendNotification
};
