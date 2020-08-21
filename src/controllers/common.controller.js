const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/response');
const Messages = require('../utils/messages');
const { cloudinaryService } = require('../services');


const uploadPic = catchAsync(async (req, res) => {
    const { secure_url } = await cloudinaryService.uploadOnCloudinary(req.file.path)
    createResponse(res, httpStatus.OK, Messages.PIC_UPLOADED, { url: secure_url })
});

module.exports = {
    uploadPic
};
