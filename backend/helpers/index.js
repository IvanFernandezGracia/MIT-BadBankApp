const generateJWT = require("./generateJWT");
const googleVerify = require("./googleVerify");

module.exports = {
  ...generateJWT,
  ...googleVerify,
};
