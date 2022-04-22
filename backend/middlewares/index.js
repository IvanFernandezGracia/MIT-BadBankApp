const validationFields = require("./validationFields");
const validationJWT = require("./validationJWT");
const validationRoles = require("./validationRoles");

module.exports = {
  ...validationFields,
  ...validationJWT,
  ...validationRoles,
};
