const cloudinary = require('./../config/cloudinary')
const AppError = require('../utils/AppError');

const uploadOnCloudinary = async (filePath) => {
    try {
        return cloudinary.v2.uploader.upload(filePath,  {
            folder: process.env.CLOUDINARY_FOLDER,
            use_filename: true
           })
    } catch (err) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Fail to upload on cloudinary');
    }
}

module.exports = { uploadOnCloudinary } 