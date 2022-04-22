const jwt = require("jsonwebtoken");

const generateTokenAccessJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    // jwt.sign(payload, secretOrPrivateKey, [options, callback])
    jwt.sign(
      payload,
      process.env.SECRET_PRIVATE_KEY_TOKEN_ACCESS,
      {
        expiresIn: process.env.EXPIRATION_TOKEN_ACCESS,
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("Could not generate token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateTokenAccessJWT,
};
