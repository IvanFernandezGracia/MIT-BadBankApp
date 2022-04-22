const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
var moment = require("moment");

const { User, StateAccount } = require("../models");

const {
  generateTokenRefreshJWT,
} = require("../helpers/generateTokenRefreshJWT");
const { generateTokenAccessJWT } = require("../helpers/generateTokenAccessJWT");
const { googleVerify } = require("../helpers/googleVerify");
const { ROLES } = require("../database/mongoConfig");
const { redisClient } = require("../database/redisConfig");

const createAccount = async (req, res = response, next) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.exists({ email });
    // Verify if the email exists
    if (userExist) {
      return res.status(400).json({
        msg: "This email already exists",
      });
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

    // Generate JWT Access
    const token_access = await generateTokenAccessJWT(userCreated._id);

    // Generate JWT Refresh
    const token_refresh = await generateTokenRefreshJWT(userCreated._id);

    // Save in Redis DB : JWT Refresh under user key
    await redisClient.set(
      user._id,
      JSON.stringify({
        refresh_token: token_refresh,
        access_token: token_access,
      }),
      (err, reply) => {
        //Dont save new Token Refresh in Redis DB
        if (err) {
          console.log(err);
          return res.status(400).json({
            msg: "user successfully registered! , but now login",
          });
        }
        console.log(reply);
      }
    );
    await redisClient.expire(user._id, process.env.EXPIRATION_DB_TOKEN_REFRESH);

    // Response token refresh (cookie) & token access (body)
    res.header("Access-Control-Expose-Headers", "newrefreshtoken");
    res.header("newrefreshtoken", true);
    res
      .status(201)
      .cookie("token_refresh", token_refresh, {
        httpOnly: true, // dont read JS
        secure: process.env.SECURE_COOKIES === "true" ? true : false, //http"S"
        sameSite: process.env.SAMESITE_COOKIES === "true" ? true : "none",
        maxAge: parseInt(process.env.EXPIRATION_COOKIE_REFRESH) * 1000, //miliseconds, same token refresh expiraton
      })
      .json({
        user: {
          name: user.name,
          email: user.email,
          url_image: user.url_image || null,
        },
        stateAccount: stateAccountCreated,
        token_access,
      });
  } catch (err) {
    next(err); // handleError middleware
  }
};

const login = async (req, res = response, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    // Verify if the email exists
    if (!user) {
      return res.status(400).json({
        msg: "Email are not register",
      });
    }

    // Verify if the stateAccount not exists
    let stateAccount = await StateAccount.findOne({ user });
    if (!stateAccount) {
      // Create state
      const stateAccountCreate = new StateAccount({
        active: "true",
        balance: "0",
        user: user,
      });

      // Save state DB
      stateAccount = await stateAccountCreate.save();
    }

    // Verify if the stateAccount active is true
    if (stateAccount.active === false) {
      return res.status(400).json({
        msg: "Account is Inactive",
      });
    }

    // Verify password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Password are not correct",
      });
    }

    // Generate JWT Access
    const token_access = await generateTokenAccessJWT(user._id);

    // Generate JWT Refresh
    const token_refresh = await generateTokenRefreshJWT(user._id);

    // Save in Redis DB : JWT Refresh under user key
    await redisClient.set(
      user._id,
      JSON.stringify({
        refresh_token: token_refresh,
        access_token: token_access,
      }),
      (err, reply) => {
        if (err) throw err;
        console.log(reply);
      }
    );
    await redisClient.expire(user._id, process.env.EXPIRATION_DB_TOKEN_REFRESH);

    // Response token refresh (cookie) & token access (body)
    res.header("Access-Control-Expose-Headers", "newrefreshtoken");
    res.header("newrefreshtoken", true);
    res
      .status(200)
      .cookie("token_refresh", token_refresh, {
        httpOnly: true, // dont read JS
        secure: process.env.SECURE_COOKIES === "true" ? true : false, //http"S"
        sameSite: process.env.SAMESITE_COOKIES === "true" ? true : "none",
        maxAge: parseInt(process.env.EXPIRATION_COOKIE_REFRESH) * 1000, //miliseconds, same token refresh expiraton
      })
      .json({
        user: {
          name: user.name,
          email: user.email,
          url_image: user.url_image || null,
        },
        stateAccount,
        token_access,
      });
  } catch (err) {
    next(err); // handleError middleware
  }
};

const googleSignin = async (req, res = response, next) => {
  const { id_token } = req.body;

  try {
    // Verify token google
    const { email, name, url_image } = await googleVerify(id_token);

    // Verifi exist user whit email
    let user = await User.findOne({ email });
    if (!user) {
      // Create User
      const userCreate = new User({
        name,
        email,
        password: "googleAuth", // it does not matter because there is the bcrypt but necessary for User Model
        url_image,
        role: ROLES.USER,
      });
      // Save User DB
      user = await userCreate.save();
    }

    // Verify if the stateAccount exist by user
    let stateAccount = await StateAccount.findOne({ user });
    if (!stateAccount) {
      // Create State Account
      const stateAccountCreate = new StateAccount({
        active: "true",
        balance: "0",
        user: user,
      });
      // Save State Account DB
      stateAccount = await stateAccountCreate.save();
    }

    // Verify if the stateAccount active is true
    if (stateAccount.active === false) {
      return res.status(400).json({
        msg: "Account is Inactive",
      });
    }

    // Generate JWT Access
    const token_access = await generateTokenAccessJWT(user._id);

    // Generate JWT Refresh
    const token_refresh = await generateTokenRefreshJWT(user._id);

    // Save in Redis DB : JWT Refresh under user key

    await redisClient.set(
      user._id,
      JSON.stringify({
        refresh_token: token_refresh,
        access_token: token_access,
      }),
      (err, reply) => {
        if (err) throw err;
        console.log(reply);
      }
    );

    await redisClient.expire(user._id, process.env.EXPIRATION_DB_TOKEN_REFRESH);

    // Response token refresh (cookie) & token access (body)
    res.header("Access-Control-Expose-Headers", "newrefreshtoken");
    res.header("newrefreshtoken", true);
    res
      .status(200)
      .cookie("token_refresh", token_refresh, {
        httpOnly: true, // dont read JS
        secure: process.env.SECURE_COOKIES === "true" ? true : false, //http"S"
        sameSite: process.env.SAMESITE_COOKIES === "true" ? true : "none",
        maxAge: parseInt(process.env.EXPIRATION_COOKIE_REFRESH) * 1000, //miliseconds, same token refresh expiraton
      })
      .json({
        user: {
          name: user.name,
          email: user.email,
          url_image: user.url_image || null,
        },
        stateAccount,
        token_access,
      });
  } catch (err) {
    next(err); // handleError middleware
  }
};

const logout = async (req, res = response, next) => {
  try {
    // Delete user refresh token from Redis
    await redisClient.del(req.userData._id, (err, reply) => {
      if (err) throw err;
      console.log(reply);
    });

    return res
      .clearCookie("token_refresh", {
        httpOnly: true, // dont read JS
        secure: process.env.SECURE_COOKIES === "true" ? true : false, //http"S"
        sameSite: process.env.SAMESITE_COOKIES === "true" ? true : "none",
      })
      .clearCookie("_csrf-my-app", {
        httpOnly: true, // dont read JS
        secure: process.env.SECURE_COOKIES === "true" ? true : false, //http"S"
        sameSite: process.env.SAMESITE_COOKIES === "true" ? true : "none",
      })
      .status(200)
      .json({ message: "Success Loggedout" });
  } catch (err) {
    next(err); // handleError middleware
  }
};

const renewTokens = async (req = request, res = response, next) => {
  try {
    res.status(200).json({ msg: "Refresh Tokens ok!" });
  } catch (err) {
    next(err); // handleError middleware
  }
};

module.exports = {
  login,
  googleSignin,
  createAccount,
  logout,
  renewTokens,
};
