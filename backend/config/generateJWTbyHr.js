const jwt = require("jsonwebtoken");
const { prompt } = require("enquirer");
require("dotenv").config();

const generateJWTbyHr = async () => {
  try {
    const response = await prompt([
      {
        type: "input",
        name: "uid",
        message: "What is your id user",
      },
      {
        type: "input",
        name: "hrs",
        message: "What is your hrs token refresh?",
      },
    ]);

    console.log(response);

    const payload = { uid: response.uid };
    console.log(payload);
    // jwt.sign(payload, secretOrPrivateKey, [options, callback])
    jwt.sign(
      payload,
      process.env.SECRET_PRIVATE_KEY,
      {
        expiresIn: `${parseInt(response.hrs)}h`,
      },
      (err, token) => {
        if (err) {
          console.log(err);
          throw Error("Could not generate token");
        } else {
          console.log(token);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

generateJWTbyHr();
