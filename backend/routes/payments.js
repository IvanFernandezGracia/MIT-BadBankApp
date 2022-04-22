const { Router } = require("express");
const { check } = require("express-validator");
const { ROLES } = require("../database/mongoConfig");

const { validationJWT, validationFields, hasRoles } = require("../middlewares");

const { paymentPost } = require("../controllers/payment");

const {
  //   existWhitdrawByIdAndUser,
  //   validatorWhitdrawIdMongo,
  //   existWhitdrawById,
} = require("../validators/models");

const {
  // amountExistsIsNumeric,
  // dateExistsIsDate,
} = require("../validators/check");

const router = Router();

/**
 * {{url}}/api/payments
 */

// Create whitdraws by useridJWT -  [USER, DEV]
router.post(
  "/",
  [
    validationJWT,
    hasRoles(ROLES.DEV, ROLES.USER),
    check("email", "email is required and format correct").isEmail(),
    check("amount", "amount must be not String").not().isString(),
    check("amount", "amount must be Numeric").isNumeric(),
    check(
      "amount",
      `amount between { min: ${process.env.MIN_DEPOSIT_BY_USER}, max: ${process.env.MAX_DEPOSIT_BY_USER} }`
    ).isFloat({
      min: Number(process.env.MIN_DEPOSIT_BY_USER),
      max: Number(process.env.MAX_DEPOSIT_BY_USER),
    }),
    validationFields,
  ],
  paymentPost
);

module.exports = router;
