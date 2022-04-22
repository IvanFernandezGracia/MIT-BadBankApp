const { Deposit } = require("../../models");
var validator = require("validator");

const validatorDepositIdMongo = async (req, res, next) => {
  const { id } = req.params;

  if (!validator.isMongoId(id)) {
    return res.status(401).json({
      msg: `Is not valid ID ${id}`,
    });
  }
  next();
};

const existDepositByIdAndUser = async (req, res, next) => {
  // Verify if the Deposit exists
  const { id } = req.params;
  const query = { _id: id, user: req.userData };

  const existDeposit = await Deposit.exists(query);

  if (!existDeposit) {
    return res.status(401).json({
      msg: `The id does not exist ${id} for user ${req.userData.email}`,
    });
  }
  next();
};

const existDepositById = async (req, res, next) => {
  // Verify if the Deposit exists
  const { id } = req.params;
  const query = { _id: id };

  const existDeposit = await Deposit.exists(query);

  if (!existDeposit) {
    return res.status(401).json({
      msg: `The id does not exist ${id}`,
    });
  }
  next();
};

module.exports = {
  existDepositByIdAndUser,
  validatorDepositIdMongo,
  existDepositById,
};
