const { Deposit } = require("../../models");
const moment = require("moment");

const existDepositById = async (id) => {
  // Verify if the Deposit exists
  const existDeposit = await Deposit.findById(id);
  if (!existDeposit) {
    throw new Error(`The id does not exist ${id}`);
  }
};

const amountExistsIsNumeric = async (amount) => {
  // if exist and not is number
  if (amount && typeof amount !== "number") {
    throw new Error(`The amount is not number: ${amount}`);
  }
};

const dateExistsIsDate = async (date) => {
  // if exist and not is date
  const dateFormat = new Date(date);
  if (date) {
    if (!moment(dateFormat).isValid()) {
      throw new Error(`The date is not Date: ${date}`);
    }
  }
};

module.exports = {
  existDepositById,
  amountExistsIsNumeric,
  dateExistsIsDate,
};
