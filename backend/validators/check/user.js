const { User } = require("../../models");

const emailExist = async (email = "") => {
  // Verify if the email exists
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new Error(`Email: ${email}, already registered`);
  }
};

const existUserById = async (id) => {
  //  Verify if the email exists
  const existUser = await User.findById(id);
  if (!existUser) {
    throw new Error(`The id does not exist ${id}`);
  }
};

module.exports = {
  emailExist,
  existUserById,
};
