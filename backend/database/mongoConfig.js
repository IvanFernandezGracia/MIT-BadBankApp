const mongoose = require("mongoose");
const { Role, Deposit, User, StateAccount } = require("../models");
var colors = require("colors/safe");
const moment = require("moment");
var random_name = require("node-random-name");
const bcryptjs = require("bcryptjs");

const ROLES = {};

const connectMongoAtlas = async () => {
  const username = encodeURIComponent(process.env.MONGO_USER);
  const password = encodeURIComponent(process.env.MONGO_PASSWORD);
  const cluster = process.env.MONGO_CLUSTER;
  const folder = process.env.MONGO_FOLDER;

  const uri = `mongodb+srv://${username}:${password}@${cluster}/${folder}`;

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };
  try {
    await mongoose.connect(uri, options).then(
      async () => {
        /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
        console.log(
          colors.green("Conectada MongoDB online!, Folder: " + folder)
        );
        await initializeRoles();
        await initializeSchemas();
      },
      (err) => {
        /** handle initial connection error */
        console.log("Error MongoDB: " + err);
      }
    );
  } catch (error) {
    console.log(error);
    // throw new Error("Error Server : don't MONGODB Connect ");
    process.exit(1);
  }
};

// Get ID MONGO ROLES
const initializeRoles = async () => {
  const allRole = await Role.find();
  ROLES.DB_ADMIN = allRole.find((RoleDB) => {
    return RoleDB.role === "DB_ADMIN";
  });
  ROLES.DEV = allRole.find((RoleDB) => {
    return RoleDB.role === "DEV";
  });
  ROLES.USER = allRole.find((RoleDB) => {
    return RoleDB.role === "USER";
  });

  console.log(colors.blue(ROLES));
};

// Create DB initial
const initializeSchemas = async () => {
  const randomIntegerInRange = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const randomName = random_name({
    last: true,
  });

  try {
    const { user, stateAccount } = await createAccount(
      randomName,
      `${randomName.toLowerCase()}.test@badbank.com`
    );

    const { deposit, balance } = await depositPost(
      randomIntegerInRange(0, 10000),
      user
    );

    console.log({ user, stateAccount, deposit, balance });
  } catch (err) {
    console.log("Error init Database Mongo ");
  }
};

// Functions for init DB
const createAccount = async (name, email, password = "passwordTest") => {
  try {
    const userExist = await User.exists({ email });
    // Verify if the email exists
    if (userExist) {
      throw Error("This email already exists");
    }
    // Create User
    const user = new User({
      name,
      email,
      role: ROLES.USER,
    });

    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Save User DB
    const userCreated = await user.save();

    // Create stateAccount
    const stateAccount = new StateAccount({
      active: "true",
      balance: "0",
      user: userCreated,
    });

    // Save stateAccount DB
    const stateAccountCreated = await stateAccount.save();

    return { user: userCreated, stateAccount: stateAccountCreated };
  } catch (err) {
    console.log(err); // handleError middleware
  }
};

const depositPost = async (amount, user) => {
  try {
    const stateAccount = await StateAccount.findOne({ user: user });

    // Verify if the stateAccount active is true
    if (stateAccount.active === false) {
      throw Error("Account is Inactive, deposits cannot be made");
    }

    // Verify if amount + balance exceeds the maximum Account allow
    if (stateAccount.balance + amount > process.env.MAX_BALANCE) {
      throw Error(
        `amount ${amount} exceeds the maximum available balance ${
          process.env.MAX_BALANCE
        } , max allow is ${process.env.MAX_BALANCE - stateAccount.balance}`
      );
    }

    // Create Deposit
    const deposit = new Deposit({
      date: Date.now(),
      amount: amount,
      user: user._id,
    });
    // Save Deposit DB
    const depositSaved = await deposit.save();

    // Sum amount to balance
    stateAccount.balance = stateAccount.balance + amount;

    // Save stateAccount whit balance new
    const stateAccountNew = await stateAccount.save();

    return {
      deposit: depositSaved,
      balance: stateAccountNew.balance,
    };
  } catch (err) {
    console.log(err); // handleError middleware
  }
};

module.exports = {
  connectMongoAtlas,
  ROLES,
};
