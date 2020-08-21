const httpStatus = require('http-status');
const { pick, get, isNil } = require('lodash');
const AppError = require('../utils/AppError');
const { Event } = require('../models');
const userService = require('./user.service')
const { getQueryOptions } = require('../utils/service.util');
const { sendPushIOS, sendPushAndroid } = require("../config/notification")

const createEvent = async eventBody => {
    const event = await Event.create(eventBody);
    return event;
};

const getEvents = async query => {
    const searchFields = ['name', 'info', 'location'];
    const { fromDate = new Date(), toDate, status } = pick(query, ['fromDate', 'toDate', 'status']);
    const filter = {};
    if (fromDate)
        filter["endDate"] = { $gte: fromDate }
    if (toDate)
        filter["startDate"] = { $lt: toDate }
    if (fromDate && toDate)
        filter["$and"] = [{ startDate: { $gte: fromDate } }, { endDate: { $lt: toDate } }]
    if (!isNil(status))
        filter["status"] = status

    const search = get(query, 'search', '');
    if (search)
        filter["$or"] = searchFields.map(field => ({ [field]: { $regex: search, $options: 'i' } }))

    const options = getQueryOptions(query);
    const events = await Event.find(filter, null, options);
    return events;
};

const getEventById = async eventId => {
    const event = await Event.findById(eventId);
    if (!event) {
        throw new AppError(httpStatus.NOT_FOUND, 'Event not found');
    }
    return event;
};

const updateEvent = async (eventId, updateBody) => {
    const event = await getEventById(eventId);
    Object.assign(event, updateBody);
    await event.save();
    return event;
};

const deleteEvent = async eventId => {
    const event = await getEventById(eventId);
    await event.remove();
    return event;
};

const acceptRSVP = async (eventId, userId) => {
    const event = await Event.findByIdAndUpdate({ _id: eventId }, {
        $addToSet: { rsvp: userId }
    }, { new: true });
    return event;
};

const rejectRSVP = async (eventId, userId) => {
    const event = await Event.findByIdAndUpdate({ _id: eventId }, {
        $pull: { rsvp: userId }
    }, { new: true });
    return event;
};

const checkEventOwner = async (eventId, userId) => {
    const count = await Event.countDocuments({ _id: eventId, createdBy: userId });
    return count > 0
}

const sendNotification = async (eventId, title, message) => {
    const users = await userService.getUsers({ role: 'user' })
    for (const user of users) {
        try {
            if (user.android_token) {
                await sendPushAndroid(user.android_token, title, message, eventId)
                console.log('android sent')
            }
            if (user.ios_token) {
                await sendPushIOS(user.ios_token, title, message, eventId)
                console.log('ios sent')
            }
        } catch (err) {
            console.log(err)
        }
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    acceptRSVP,
    rejectRSVP,
    checkEventOwner,
    sendNotification
};
