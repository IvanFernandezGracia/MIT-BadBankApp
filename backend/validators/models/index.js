const validatorDeposit = require("./deposit");
const validatorWhitdraw = require("./whitdraw");

module.exports = {
  ...validatorDeposit,
  ...validatorWhitdraw
};
