const moment = require('moment');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const config = require('../config/config');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const AppError = require('../utils/AppError');

const generateAuthTokens = async userId => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = tokenService.generateToken(userId, accessTokenExpires);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = tokenService.generateToken(userId, refreshTokenExpires);
  await tokenService.saveToken(refreshToken, userId, refreshTokenExpires, 'refresh');

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const checkPassword = async (password, correctPassword) => {
  const isPasswordMatch = await bcrypt.compare(password, correctPassword);
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }
};

const checkStatus = async (user) => {
  if (user && user.status == 0)
    throw new AppError(httpStatus.UNAUTHORIZED, 'Your account is disabled by Admin. Please contact admin for more details')
};

const loginUser = async (email, password, device_token, device_type) => {
  let user;
  try {
    user = await userService.getUserByEmail(email);
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  await checkPassword(password, user.password);
  await checkStatus(user);

  console.log(device_token, device_type)
  if (device_type === 'android') {
    console.log('android')
    user.android_token = device_token
  }
  if (device_type === 'ios') {
    console.log('ios')
    user.ios_token = device_token
  }
  await user.save()
  return user;
};

const refreshAuthTokens = async refreshToken => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, 'refresh');
    const userId = refreshTokenDoc.user;
    await userService.getUserById(userId);
    await refreshTokenDoc.remove();
    return await generateAuthTokens(userId);
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

const generateResetPasswordToken = async email => {
  const user = await userService.getUserByEmail(email);
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = tokenService.generateToken(user._id, expires);
  await tokenService.saveToken(resetPasswordToken, user._id, expires, 'resetPassword');
  return resetPasswordToken;
};

const resetPassword = async (resetPasswordToken, newPassword) => {
  let userId;
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, 'resetPassword');
    userId = resetPasswordTokenDoc.user;
    await userService.updateUser(userId, { password: newPassword });
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
  await Token.deleteMany({ user: userId, type: 'resetPassword' });
};

const logout = async (userId, device_type) => {
  try {
    let fileds;
    if (device_type === 'android') 
      fileds = { android_token: '' }
    if (device_type === 'ios') 
      fileds = { ios_token: '' }
    await userService.updateUser(userId, fileds);
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Logout failed');
  }
};

module.exports = {
  generateAuthTokens,
  loginUser,
  refreshAuthTokens,
  generateResetPasswordToken,
  resetPassword,
  logout
};
