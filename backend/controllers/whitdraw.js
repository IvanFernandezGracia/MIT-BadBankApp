const { response } = require("express");
const { Whitdraw, StateAccount } = require("../models");
var createError = require("http-errors");

const whitdrawGet = async (req, res = response, next) => {
  try {
    const { limit = 5, from = 0 } = req.query;
    const query = { user: req.userData._id };

    const [total, whitdraw] = await Promise.all([
      Whitdraw.countDocuments(query),
      Whitdraw.find(query)
        .populate("user", "email")
        .skip(Number(from))
        .limit(Number(limit)),
    ]);

    res.json({
      total,
      whitdraw,
    });
  } catch (err) {
    next(err); // handleError middleware
  }
};

const whitdrawIdGet = async (req, res = response, next) => {
  try {
    const { id } = req.params;
    const query = { _id: id, user: req.userData._id };

    const whitdraw = await Whitdraw.find(query)
      .populate("user", "name")
      .populate("user", "email");

    res.json(whitdraw);
  } catch (err) {
    next(err); // handleError middleware
  }
};

const whitdrawPost = async (req, res = response, next) => {
  try {
    const { amount } = req.body;

    const stateAccount = await StateAccount.findOne({ user: req.userData });

    // Verify if the stateAccount active is true
    if (stateAccount.active === false) {
      return res.status(400).json({
        msg: "Account is Inactive, whitdraw cannot be made",
      });
    }
    // Verify if amount exceeds the maximum
    const amountMax = stateAccount.balance;
    if (amount > amountMax) {
      return res.status(400).json({
        msg: `Amount ${amount} withdrawn exceeds the maximum allowed ${amountMax}`,
        balance: stateAccount.balance,
      });
    }

    // Create Whitdraw
    const whitdraw = new Whitdraw({
      date: Date.now(),
      amount: amount,
      user: req.userData._id,
    });
    // Save Whitdraw DB
    const whitdrawSaved = await whitdraw.save();

    // Rest amount to balance
    stateAccount.balance = stateAccount.balance - amount;

    // Save stateAccount whit balance new
    const stateAccountNew = await stateAccount.save();

    res.status(201).json({
      whitdraw: whitdrawSaved,
      balance: stateAccountNew.balance,
    });
  } catch (err) {
    next(err); // handleError middleware
  }
};

const whitdrawPut = async (req, res = response, next) => {
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

    const whitdraw = await Whitdraw.findByIdAndUpdate(id, data, { new: true });
    res.json(whitdraw);
  } catch (err) {
    next(err); // handleError middleware
  }
};

const whitdrawDelete = async (req, res = response, next) => {
  try {
    const { id } = req.params;
    const whitdrawDelete = await Whitdraw.findByIdAndDelete(id, { new: false });

    res.json(whitdrawDelete);
  } catch (err) {
    next(err); // handleError middleware
  }
};

module.exports = {
  whitdrawIdGet,
  whitdrawGet,
  whitdrawPost,
  whitdrawPut,
  whitdrawDelete,
};
