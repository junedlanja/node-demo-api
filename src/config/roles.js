const roles = ['user', 'admin', 'staff'];

const roleRights = new Map();
roleRights.set(roles[0], ['profile', 'getEvents', 'manageRSVP']);
roleRights.set(roles[1], ['profile', 'getUsers', 'manageUsers', 'getEvents', 'manageEvents', 'assignRole', 'sendNotification']);
roleRights.set(roles[2], ['profile', 'getUsers', 'manageUsers', 'getEvents', 'manageEvents', 'sendNotification']);

module.exports = {
  roles,
  roleRights,
};
