const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
var validator = require("validator");
const { ObjectId } = require("mongoose").Types;

const User = require("../models/user");
const StateAccount = require("../models/stateAccount");

const { Role } = require("../models");

var createError = require("http-errors");

const userGet = async (req = request, res = response, next) => {
  try {
    const { limit = 5, from = 0 } = req.query;
    const query = {};

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .skip(!isNaN(Number(from)) ? Number(from) : 0)
        .limit(!isNaN(Number(limit)) ? Number(limit) : 5),
    ]);

    const usersIDs = users.map((user) => {
      return ObjectId(user._id);
    });

    const statesAccountsAndUsers = await StateAccount.find({
      user: { $in: usersIDs },
    }).populate("user", "name email url_image -_id");

    const usersSend = statesAccountsAndUsers.map((stateAccount) => {
      const user = {
        ...stateAccount.user.toObject(),
        balance: stateAccount.balance,
      };
      return user;
    });

    res.json({
      total,
      users: usersSend,
    });
  } catch (err) {
    next(err); // handleError middleware
  }
};

const userPost = async (req = request, res = response, next) => {
  try {
    const { name, email, id_role, password } = req.body;

    // Verify if the email exists
    const userExist = await User.exists({ email });
    if (userExist) {
      return res.status(400).json({
        msg: "This email already exists",
      });
    }

    // Create User
    const user = new User({ name, email, password, role: id_role });

    // Encrypt the password
    const salt = bcryptjs.genSaltSync(); //more return encryption : 10 by default
    user.password = bcryptjs.hashSync(password, salt); // hash una sola via

    // Save User DB
    const userCreated = await user.save();

    // Create StateAccount
    const stateAccount = new StateAccount({
      active: "true",
      balance: "0",
      user: userCreated,
    });

    // Save StateAccount DB
    await stateAccount.save();

    res.json({
      user,
      stateAccount,
    });
  } catch (err) {
    next(err); // handleError middleware
  }
};

const userPut = async (req, res = response, next) => {
  try {
    const { id } = req.params;
    const { name, password, id_role, url_image } = req.body;

    const data = {};
    if (name) {
      data.name = name;
    }
    if (password) {
      // Encrypt the password
      const salt = bcryptjs.genSaltSync();
      const passwordHash = bcryptjs.hashSync(password, salt);
      data.password = passwordHash;
    }
    if (id_role) {
      // Validate mongo id id_mongo
      if (!validator.isMongoId(id_role)) {
        throw createError(500, "Is not ID valid!!");
      }

      // Validate include Role exists id_mongo
      const existRole = await Role.exists({ _id: id_role });
      if (!existRole) {
        throw createError(
          500,
          `The role ${id_role} is not registered in the DB`
        );
      }

      // Save role in data
      data.role = id_role;
    }
    if (url_image) {
      data.url_image = url_image;
    }

    // Validate exist propertys request body add data
    if (Object.keys(data).length === 0) {
      throw createError(505, "there are no changes to be made");
    }
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    // const user = await User.findOneAndUpdate(id, data);

    res.json(user);
  } catch (err) {
    console.log(err);
    next(err); // handleError middleware
  }
};

const userDelete = async (req, res = response) => {
  const { id } = req.params;

  // We physically erase it??? is that correct?
  // const user = await User.findByIdAndDelete( id );

  const user = await User.findByIdAndDelete(id);

  res.json(user);
};

const searchUser = async (req = request, res = response, next) => {
  try {
    const { term } = req.params;
    const { limit = 5, from = 0 } = req.query;
    const query = {};

    console.log("term", term);
    const isMongoID = ObjectId.isValid(term);

    let users = [];
    // Search by ID
    if (isMongoID) {
      users = await User.findById(term);
    } else {
      // Search by Property
      const regex = new RegExp(term, "i");
      users = await User.find({
        $or: [{ name: regex }, { email: regex }],
      })
        .skip(!isNaN(Number(from)) ? Number(from) : 0)
        .limit(!isNaN(Number(limit)) ? Number(limit) : 5);
    }

    const usersIDs = users.map((user) => {
      return ObjectId(user._id);
    });

    const statesAccountsAndUsers = await StateAccount.find({
      user: { $in: usersIDs },
    }).populate("user", "name email url_image -_id");

    const usersSend = statesAccountsAndUsers.map((stateAccount) => {
      const user = {
        ...stateAccount.user.toObject(),
        balance: stateAccount.balance,
      };
      return user;
    });

    res.json({
      users: usersSend,
    });
  } catch (err) {
    next(err); // handleError middleware
  }
};

module.exports = {
  userGet,
  userPost,
  userPut,
  userDelete,
  searchUser,
};
