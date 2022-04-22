const { Router } = require("express");
const { check } = require("express-validator");

const { validationFields } = require("../middlewares/validationFields");
const { validationJWT } = require("../middlewares");

const {
  createAccount,
  login,
  googleSignin,
  FirebaseSignin,
  logout,
  renewTokens,
} = require("../controllers/auth");

const router = Router();

//  Register - [PUBLIC]
router.post(
  "/createAccount",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "email is required and format correct").isEmail(),
    check("password", "password is required").not().isEmpty(),
    validationFields,
  ],
  createAccount
);

//  Login - [PUBLIC]
router.post(
  "/login",
  [
    check("email", "email is required and format correct").isEmail(),
    check("password", "password is required").not().isEmpty(),
    validationFields,
  ],
  login
);

// Login Google & Register- [PUBLIC]
router.post(
  "/google",
  [
    check("id_token", "id_token google is required").not().isEmpty(),
    validationFields,
  ],
  googleSignin
);

router.get("/logout", validationJWT, logout);

router.post("/renewTokens", validationJWT, renewTokens);

// Login Firebase & Register- [PUBLIC]
// router.post(
//   "/firebase",
//   [check("id_token", "id_token firebase is required").not().isEmpty(), validationFields],
//   FirebaseSignin
// );

module.exports = router;
