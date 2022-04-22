const { response } = require("express");
const { Deposit, StateAccount } = require("../models");

var createError = require("http-errors");

const depositGet = async (req, res = response, next) => {
  try {
    const { limit = 5, from = 0 } = req.query;
    const query = { user: req.userData._id };

    const [total, deposits] = await Promise.all([
      Deposit.countDocuments(query),
      Deposit.find(query)
        .populate("user", "email")
        .skip(Number(from))
        .limit(Number(limit)),
    ]);

    res.json({
      total,
      deposits,
    });
  } catch (err) {
    next(err); // handleError middleware
  }
};

const depositIdGet = async (req, res = response, next) => {
  try {
    const { id } = req.params;
    const query = { _id: id, user: req.userData._id };

    const deposit = await Deposit.find(query)
      .populate("user", "name")
      .populate("user", "email");

    res.json(deposit);
  } catch (err) {
    next(err); // handleError middleware
  }
};

const depositPost = async (req, res = responsem, next) => {
  try {
    const { amount } = req.body;

    const stateAccount = await StateAccount.findOne({ user: req.userData });

    // Verify if the stateAccount active is true
    if (stateAccount.active === false) {
      return res.status(400).json({
        msg: "Account is Inactive, deposits cannot be made",
      });
    }

    // Verify if amount + balance exceeds the maximum Account allow
    if (stateAccount.balance + amount > process.env.MAX_BALANCE) {
      return res.status(400).json({
        msg: `amount ${amount} exceeds the maximum available balance ${
          process.env.MAX_BALANCE
        } , max allow is ${process.env.MAX_BALANCE - stateAccount.balance}`,
        balance: stateAccount.balance,
      });
    }

    // Create Deposit
    const deposit = new Deposit({
      date: Date.now(),
      amount: amount,
      user: req.userData._id,
    });
    // Save Deposit DB
    const depositSaved = await deposit.save();

    // Sum amount to balance
    stateAccount.balance = stateAccount.balance + amount;

    // Save stateAccount whit balance new
    const stateAccountNew = await stateAccount.save();

    res.status(201).json({
      deposit: depositSaved,
      balance: stateAccountNew.balance,
    });
  } catch (err) {
    next(err); // handleError middleware
  }
};

const depositPut = async (req, res = response, next) => {
  try {
    const { id } = req.params;
    const { amount, date } = req.body;

    const data = {};

    if (amount) {
      data.amount = amount;
    }
    if (date) {
      data.date = date;
    }

    // Validate exist propertys request body add data
    if (Object.keys(data).length === 0) {
      throw createError(505, "there are no changes to be made");
    }

    const deposit = await Deposit.findByIdAndUpdate(id, data, { new: true });
    res.json(deposit);
  } catch (err) {
    next(err); // handleError middleware
  }
};

const depositDelete = async (req, res = response, next) => {
  try {
    const { id } = req.params;
    const depositDelete = await Deposit.findByIdAndDelete(id, { new: false });

    res.json(depositDelete);
  } catch (err) {
    next(err); // handleError middleware
  }
};

module.exports = {
  depositIdGet,
  depositGet,
  depositPost,
  depositPut,
  depositDelete,
};
