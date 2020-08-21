const express = require('express');
const publicRoute = require('./public.route');
const apiDocsRoute = require('./api-docs.route');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const eventRoute = require('./event.route');
const commonRoute = require('./common.route');

const router = express.Router();
router.use('/', publicRoute )
router.use('/api-docs', apiDocsRoute);
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/events', eventRoute);
router.use('/common', commonRoute);

module.exports = router;
