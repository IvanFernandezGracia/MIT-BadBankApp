const jwt = require("jsonwebtoken");

const generateTokenRefreshJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    // jwt.sign(payload, secretOrPrivateKey, [options, callback])
    jwt.sign(
      payload,
      process.env.SECRET_PRIVATE_KEY_TOKEN_REFRESH,
      {
        expiresIn: process.env.EXPIRATION_TOKEN_REFRESH,
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
  generateTokenRefreshJWT,
};
