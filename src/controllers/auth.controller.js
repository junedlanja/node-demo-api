const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/response');
const Messages = require('../utils/messages');
const { authService, userService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await authService.generateAuthTokens(user.id);
  const response = { user: user.transform(), tokens };
  createResponse(res, httpStatus.CREATED, Messages.ACCOUNT_CREATED, response)
});

const login = catchAsync(async (req, res) => {
  const user = await authService.loginUser(req.body.email, req.body.password, req.body.device_token, req.body.device_type);
  const tokens = await authService.generateAuthTokens(user.id);
  const response = { user: user.transform(), tokens };
  createResponse(res, httpStatus.OK, Messages.LOGIN, response)
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuthTokens(req.body.refreshToken);
  const response = { ...tokens };
  createResponse(res, httpStatus.OK, Messages.REFRESH_TOKEN, { tokens: response })
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await authService.generateResetPasswordToken(req.body.email);
  const user = await userService.getUserByEmail(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, {
    ...user.toJSON(),
    token: resetPasswordToken
  });
  createResponse(res, httpStatus.OK, Messages.FORGOT_PASSWORD, {})
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  createResponse(res, httpStatus.OK, Messages.RESET_PASSWORD, {})
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.user._id, req.body.device_type);
  createResponse(res, httpStatus.OK, Messages.LOGOUT, {})
});

module.exports = {
  register,
  login,
  refreshTokens,
  forgotPassword,
  resetPassword,
  logout
};
