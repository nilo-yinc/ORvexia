const getCurrentUser = require('../common/get-current-user.js');

const isStillVerified = async ($) => {
  const currentUser = await getCurrentUser($);
  return !!currentUser.resourceName;
};

module.exports = isStillVerified;
