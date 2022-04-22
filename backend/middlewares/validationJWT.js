const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const { redisClient } = require("../database/redisConfig");
const { generateTokenAccessJWT } = require("../helpers/generateTokenAccessJWT");
const {
  generateTokenRefreshJWT,
} = require("../helpers/generateTokenRefreshJWT");
const User = require("../models/user");

// Verify token access and after token refresh

const validationJWT = async (req = request, res = response, next) => {
  try {
    // Get Tokens
    const accessToken = req.header("token_access") || null;
    const refreshToken = req.cookies.token_refresh || null;

    console.log("------------------- [validationJWT] -----------------");
    console.log({ refreshToken: refreshToken, accessToken: accessToken });
    // res.removeHeader("newaccesstoken");
    // res.removeHeader("newrefreshtoken");

    // Verify Exist Token accessToken and refreshToken  ?
    if (!(await verifyExistTokens(refreshToken, accessToken))) {
      return res.status(401).json({
        msg: "Required token (access or refresh)",
      });
    }

    // Verify Token Access is Valid & exist uid
    const { uid, isValidTokenAccess } = await verifyAccessTokenIsValid(
      accessToken
    );
    if (!isValidTokenAccess) {
      return res.status(401).json({
        msg: "Token Access Invalid",
      });
    }
    if (!uid) {
      return res.status(401).json({
        msg: "Dont exist uid inside Token Access",
      });
    }
    // Verify uid User exist in DB Mongo  ?
    const { userDB } = await verifyUserIdExistDB(uid);
    if (!userDB) {
      return res.status(401).json({
        msg: "User whit uid dont exist in DB Mongo",
      });
    } else {
      req.userData = userDB;
    }

    // Verify Token Access Expirate
    const { isExpiratedTokenAccess, ErrorVerifyAccessToken } =
      await verifyAccessTokenIsExpirated(accessToken);
    if (!isExpiratedTokenAccess && !ErrorVerifyAccessToken) {
      // console.log("next1", res.getHeaders());
      next();
    } else if (isExpiratedTokenAccess && !ErrorVerifyAccessToken) {
      // Verify  token refresh request  is same (uid , token refresh) in Redis DB
      const { isSameRefreshToken } = await verifyTokenRefreshRequestSameRedisDB(
        uid,
        refreshToken,
        accessToken
      );
      if (!isSameRefreshToken) {
        return res.status(401).json({
          msg: "Token Refresh dont exist or Token Refresh is not same DB or Token Access is not same DB",
        });
      }
      // Verify Token Refresh is Valid & exist uid
      const { isValidTokenRefresh, uid_refresh_token } =
        await verifyAccessRefreshIsValid(refreshToken);
      if (!isValidTokenRefresh) {
        return res.status(401).json({
          msg: "Token Refresh Invalid",
        });
      }
      if (!uid_refresh_token) {
        return res.status(401).json({
          msg: "Dont exist uid inside Token Refresh",
        });
      }
      if (!(uid_refresh_token === uid)) {
        return res.status(401).json({
          msg: "uid's token access and refresh is not same",
        });
      }
      // Verify Token Refresh Expirate
      const { isExpiratedTokenRefresh, ErrorVerifyRefreshToken } =
        await verifyRefreshTokenIsExpirated(refreshToken);

      if (!isExpiratedTokenRefresh && !ErrorVerifyRefreshToken) {
        console.log("Token access new");
        // New Token Access
        const newAccessToken = await generateTokenAccessJWT(uid);

        // Save DB New Token Access & (!New Token Refresh)
        const { saveNewTokens } = await saveRedisDBNewTokenAccess(
          uid,
          newAccessToken,
          refreshToken,
          true
        );
        if (!saveNewTokens) {
          return res.status(401).json({
            msg: "Don't save New Access Token",
          });
        }
        //Send into header New Token Access
        res.header("Access-Control-Expose-Headers", [
          "newaccesstoken",
          "Cache-Control",
          "Expires",
          "Pragma",
        ]);
        res.header("newaccesstoken", newAccessToken);
        res.header(
          "Cache-Control",
          "private, no-cache, no-store, must-revalidate"
        );
        res.header("Expires", "-1");
        res.header("Pragma", "no-cache");

        // console.log({ newaccesstoken: newAccessToken });

        // console.log("next2", res.getHeaders());
        next();
      } else if (isExpiratedTokenRefresh && !ErrorVerifyRefreshToken) {
        console.log("Token access new & Token Refresh");

        // New Token Refresh
        const newTokenRefresh = await generateTokenRefreshJWT(uid);

        //Send into cookie New Token Refresh
        res.cookie("token_refresh", newTokenRefresh, {
          httpOnly: true, // dont read JS
          secure: process.env.SECURE_COOKIES === "true" ? true : false, //http"S"
          sameSite: process.env.SAMESITE_COOKIES === "true" ? true : "none",
          maxAge: parseInt(process.env.EXPIRATION_COOKIE_REFRESH) * 1000, //miliseconds, same token refresh expiraton
        });

        // New Token Access
        const newAccessToken = await generateTokenAccessJWT(uid);
        // Save DB New Token Access & (!New Token Refresh)
        const { saveNewTokens } = await saveRedisDBNewTokenAccess(
          uid,
          newAccessToken,
          newTokenRefresh
        );
        if (!saveNewTokens) {
          return res.status(401).json({
            msg: "Don't save New Access Token",
          });
        }
        res.header("Access-Control-Expose-Headers", [
          "newaccesstoken",
          "newrefreshtoken",
          "Cache-Control",
          "Expires",
          "Pragma",
        ]);
        res.header("newaccesstoken", newAccessToken);
        res.header("newrefreshtoken", true);
        res.header(
          "Cache-Control",
          "private, no-cache, no-store, must-revalidate"
        );
        res.header("Expires", "-1");
        res.header("Pragma", "no-cache");

        // console.log({
        //   newaccesstoken: newAccessToken,
        //   newrefreshtoken: newTokenRefresh,
        // });
        // console.log("next3", res.getHeaders());

        next();
      } else {
        return res.status(401).json({
          msg: "Error Verify Token Refresh Expirate",
        });
      }
    } else {
      return res.status(401).json({
        msg: "Error Verify Token Access Expirate",
      });
    }
  } catch (err) {
    console.log("ERRORFINAL" + err);
    return res.status(401).json({
      msg: `Error Server Validations Tokens: ${err || ""}`,
    });
  }
};

////////////////////////
//FUNCTION VALIDATIONS
////////////////////////

const saveRedisDBNewTokenAccess = async (
  uid,
  saveAccessToken,
  saveRefreshToken,
  isOnlyAccessToken = false
) => {
  let resp = { saveNewTokens: false };
  try {
    if (isOnlyAccessToken) {
      console.log("Guardar Redis : Access");
      await redisClient.set(
        uid,
        JSON.stringify({
          refresh_token: saveRefreshToken,
          access_token: saveAccessToken,
        }),
        {
          KEEPTTL: true, // Conservar el tiempo de vida asociado con la clave.
        }
      );
    } else {
      console.log("Guardar Redis : Access& Refresh");
      await redisClient.set(
        uid,
        JSON.stringify({
          refresh_token: saveRefreshToken,
          access_token: saveAccessToken,
        }),
        {
          EX: process.env.EXPIRATION_DB_TOKEN_REFRESH, // Conservar el tiempo de vida asociado con la clave.
        }
      );
    }

    resp.saveNewTokens = true;
    return resp;
  } catch (err) {
    resp.saveNewTokens = false;
    return resp;
  }
};
const verifyRefreshTokenIsExpirated = async (refreshToken) => {
  let resp = {
    isExpiratedTokenRefresh: true,
    ErrorVerifyRefreshToken: true,
  };
  try {
    jwt.verify(refreshToken, process.env.SECRET_PRIVATE_KEY_TOKEN_REFRESH);
    resp.isExpiratedTokenRefresh = false;
    resp.ErrorVerifyRefreshToken = false;
    return resp;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      resp.ErrorVerifyRefreshToken = false;
      return resp;
    } else {
      resp.isExpiratedTokenRefresh = false;
      return resp;
    }
  }
};
const verifyAccessRefreshIsValid = async (refreshToken) => {
  let resp = {
    isValidTokenRefresh: false,
    uid_refresh_token: null,
  };
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.SECRET_PRIVATE_KEY_TOKEN_REFRESH,
      { ignoreExpiration: true }
    );
    resp.isValidTokenRefresh = true;
    if (decoded.uid) {
      resp.uid_refresh_token = decoded.uid;
      return resp;
    } else {
      return resp;
    }
  } catch (err) {
    resp.isValidTokenRefresh = false;
    return resp;
  }
};

const verifyTokenRefreshRequestSameRedisDB = async (
  uid,
  refreshToken,
  accessToken
) => {
  let resp = {
    isSameRefreshToken: false,
  };
  try {
    const redis_token = JSON.parse(
      await redisClient.get(uid, function (err, val) {
        return err ? null : val ? val : null;
      })
    );
    // console.log(redis_token);
    if (
      redis_token &&
      redis_token.refresh_token === refreshToken &&
      redis_token.access_token === accessToken
    ) {
      resp.isSameRefreshToken = true;
      return resp;
    } else {
      return resp;
    }
  } catch (err) {
    return resp;
  }
};

const verifyAccessTokenIsExpirated = async (accessToken) => {
  let resp = {
    isExpiratedTokenAccess: true,
    ErrorVerifyAccessToken: true,
  };
  try {
    jwt.verify(accessToken, process.env.SECRET_PRIVATE_KEY_TOKEN_ACCESS);
    resp.isExpiratedTokenAccess = false;
    resp.ErrorVerifyAccessToken = false;
    return resp;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      resp.ErrorVerifyAccessToken = false;
      return resp;
    } else {
      resp.isExpiratedTokenAccess = false;
      return resp;
    }
  }
};

const verifyUserIdExistDB = async (uid) => {
  let resp = { userDB: null };
  const user = await User.findById(uid).populate("role", "_id");
  if (user) {
    resp.userDB = user;
  }
  return resp;
};

const verifyAccessTokenIsValid = async (accessToken) => {
  let resp = {
    isValidTokenAccess: false,
    uid: null,
  };
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.SECRET_PRIVATE_KEY_TOKEN_ACCESS,
      { ignoreExpiration: true }
    );
    resp.isValidTokenAccess = true;
    if (decoded.uid) {
      resp.uid = decoded.uid;
      return resp;
    } else {
      return resp;
    }
  } catch (err) {
    resp.isValidTokenAccess = false;
    return resp;
  }
};

const verifyExistTokens = async (accessToken, refreshToken) => {
  if (!accessToken || !refreshToken) {
    return false;
  } else {
    return true;
  }
};

module.exports = {
  validationJWT,
};
