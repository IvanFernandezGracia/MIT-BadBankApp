const { response } = require("express");
const { Payment, StateAccount, User } = require("../models");
var createError = require("http-errors");

const paymentPost = async (req, res = response, next) => {
  try {
    const { amount, email } = req.body;
    console.log({ amount, email });

    // Create UserTo
    const userTo = await User.findOne({ email });
    const userTo_id = userTo._id;
    if (!userTo_id) {
      return res.status(400).json({
        msg: "This email dont exists",
      });
    }
    console.log("userTo_id", userTo_id);

    // Create UserFrom
    const userFrom = req.userData;
    const userFrom_id = userFrom._id;
    console.log("userFrom_id", userFrom_id);

    // Verify same user
    if (userFrom_id.toString() === userTo_id.toString()) {
      return res.status(400).json({
        msg: "you cannot payment yourself",
      });
    }

    //Create  state Account (UserTo)
    const stateAccountUserTo = await StateAccount.findOne({
      user: userTo_id,
    });
    if (!stateAccountUserTo) {
      return res.status(400).json({
        msg: "State Account dont exist",
      });
    }
    console.log("stateAccountUserTo", stateAccountUserTo);

    //Create  state Account (UserFrom)
    const stateAccountUserFrom = await StateAccount.findOne({
      user: userFrom_id,
    });
    if (!stateAccountUserFrom) {
      return res.status(400).json({
        msg: "State Account dont exist",
      });
    }
    console.log("stateAccountUserFrom", stateAccountUserFrom);

    // Verify if the stateAccount active is true (UserFrom)
    if (stateAccountUserFrom.active === false) {
      return res.status(400).json({
        msg: "Account is Inactive, whitdraw cannot be made",
      });
    }
    // Verify if amount exceeds the maximum (UserFrom)
    const amountMax = stateAccountUserFrom.balance;
    if (amount > amountMax) {
      return res.status(400).json({
        msg: `Amount ${amount} withdrawn exceeds the maximum allowed ${amountMax}`,
        balance: stateAccountUserFrom.balance,
      });
    }

    // Decrease balance (UserFrom) and Save
    stateAccountUserFrom.balance = stateAccountUserFrom.balance - amount;
    const stateAccountNewUserFrom = await stateAccountUserFrom.save();

    // Increment balance (UserTo) and Save
    stateAccountUserTo.balance = stateAccountUserTo.balance + amount;
    await stateAccountUserTo.save();

    // Create Payment
    const payment = new Payment({
      date: Date.now(),
      amount: amount,
      from: userFrom_id,
      to: userTo_id,
    });

    // Save Payment DB
    const paymentSaved = await payment.save();

    res.status(201).json({
      payment: {
        date: paymentSaved.date,
        amount: paymentSaved.amount,
        to: userTo.email,
        from: userFrom.email,
      },
      balance: stateAccountNewUserFrom.balance,
    });
  } catch (err) {
    next(err); // handleError middleware
  }
};

module.exports = {
  paymentPost,
};
