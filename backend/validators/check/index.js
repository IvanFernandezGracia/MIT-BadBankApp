const checkDeposit = require("./deposit");
const checkRole = require("./role");
const checkUser = require("./user");

module.exports = {
  ...checkDeposit,
  ...checkRole,
  ...checkUser,
};
