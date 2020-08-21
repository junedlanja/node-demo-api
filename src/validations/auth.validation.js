const Joi = require('@hapi/joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .custom(password),
    name: Joi.string().required(),
    role: Joi.string().valid('user', 'staff', 'admin'),
    pic: Joi.string().uri()
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    device_token: Joi.string(),
    device_type: Joi.string().valid('android', 'ios'),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string()
      .required()
      .custom(password),
  }),
};

const logout = {
  body: Joi.object().keys({
    device_type: Joi.string().valid('android', 'ios'),
  }),
};

module.exports = {
  register,
  login,
  refreshTokens,
  forgotPassword,
  resetPassword,
  logout
};
