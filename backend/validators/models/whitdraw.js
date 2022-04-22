const { Whitdraw } = require("../../models");
var validator = require("validator");

const validatorWhitdrawIdMongo = async (req, res, next) => {
  const { id } = req.params;

  if (!validator.isMongoId(id)) {
    return res.status(401).json({
      msg: `Is not valid ID ${id}`,
    });
  }
  next();
};

const existWhitdrawByIdAndUser = async (req, res, next) => {
  // Verify if the Whitdraw exists
  const { id } = req.params;
  const query = { _id: id, user: req.userData };

  const existWhitdraw = await Whitdraw.exists(query);

  if (!existWhitdraw) {
    return res.status(401).json({
      msg: `The id does not exist ${id} for user ${req.userData.email}`,
    });
  }
  next();
};

const existWhitdrawById = async (req, res, next) => {
  // Verify if the Whitdraw exists
  const { id } = req.params;
  const query = { _id: id };

  const existWhitdraw = await Whitdraw.exists(query);

  if (!existWhitdraw) {
    return res.status(401).json({
      msg: `The id does not exist ${id}`,
    });
  }
  next();
};

module.exports = {
  existWhitdrawByIdAndUser,
  validatorWhitdrawIdMongo,
  existWhitdrawById,
};
