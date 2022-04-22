const { prompt } = require("enquirer");
const bcryptjs = require("bcryptjs");

const generatePrivateKeyJWT = async () => {
  try {
    const response = await prompt([
      {
        type: "input",
        name: "password",
        message: "What is your private key JWT?",
      },
      {
        type: "input",
        name: "cicleNumber",
        message: "What is your number cicle hash?",
      },
    ]);

    console.log(response);

    // Encrypt password
    const salt = bcryptjs.genSaltSync(parseInt(response.cicleNumber));
    const passwordHash = bcryptjs.hashSync(response.password, salt);
    console.log(passwordHash);

    // require("crypto").randomBytes(32, function (err, buffer) {
    //   var ACCESS_TOKEN_SECRET = buffer.toString("hex");
    // });
  } catch (error) {
    console.log(error);
  }
};

generatePrivateKeyJWT();
