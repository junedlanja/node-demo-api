const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/response');
const Messages = require('../utils/messages');
const { userService, cloudinaryService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  createResponse(res, httpStatus.CREATED, Messages.USER_CREATED, { user: user.transform() })
});

const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers(req.query);
  const response = users.map(user => user.transform());
  createResponse(res, httpStatus.OK, Messages.USER_LIST, { users: response })
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  createResponse(res, httpStatus.OK, Messages.USER_FETCHED, { user: user.transform() })
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.userId, req.body);
  createResponse(res, httpStatus.OK, Messages.USER_UPDATED, { user: user.transform() })
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.userId);
  createResponse(res, httpStatus.OK, Messages.USER_DELETED, { userId: req.params.userId })
});

const enableUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.userId, { status: 1 });
  createResponse(res, httpStatus.OK, Messages.USER_ENABLED, { user: user.transform() })
});

const disableUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.userId, { status: 0 });
  createResponse(res, httpStatus.OK, Messages.USER_DISABLED, { user: user.transform() })
});

const changePassword = catchAsync(async (req, res) => {
  const user = await userService.changePassword(req.params.userId, req.body);
  createResponse(res, httpStatus.OK, Messages.PASSWORD_CHANGED, { user: user.transform() })
});

const changeProfilePic = catchAsync(async (req, res) => {
  const { secure_url } = await cloudinaryService.uploadOnCloudinary(req.file.path)
  const user = await userService.updateUser(req.params.userId, { pic: secure_url });
  createResponse(res, httpStatus.OK, Messages.USER_UPDATED, { user: user.transform() })
});

const assignRole = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.userId, { status: 1, role: req.body.role });
  createResponse(res, httpStatus.OK, Messages.ROLE_ASSIGNED, { user: user.transform() })
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  enableUser,
  disableUser,
  changePassword,
  changeProfilePic,
  assignRole
};
