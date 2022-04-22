const { Router } = require("express");
const { check } = require("express-validator");
const { ROLES } = require("../database/mongoConfig");

const {
  validationJWT,
  validationFields,
  isAdminRole,
  hasRoles,
} = require("../middlewares");

const {
  depositGet,
  depositIdGet,
  depositPost,
  depositPut,
  depositDelete,
} = require("../controllers/deposit");

const {
  existDepositByIdAndUser,
  validatorDepositIdMongo,
  existDepositById,
} = require("../validators/models");

const {
  amountExistsIsNumeric,
  dateExistsIsDate,
} = require("../validators/check");
const router = Router();

/**
 * {{url}}/api/deposits
 */

//  Get all deposit by useridJWT - [USER, DEV]
router.get(
  "/",
  [validationJWT, hasRoles(ROLES.DEV, ROLES.USER), validationFields],
  depositGet
);

// Get a deposit id by useridJWT-  [USER, DEV]
router.get(
  "/:id",
  [
    validationJWT,
    hasRoles(ROLES.DEV, ROLES.USER),
    validatorDepositIdMongo,
    existDepositByIdAndUser,
    validationFields,
  ],
  depositIdGet
);

// Create deposit by useridJWT -  [USER, DEV]
router.post(
  "/",
  [
    validationJWT,
    hasRoles(ROLES.DEV, ROLES.USER),
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
  depositPost
);

// Update deposit -   [ADMINDB]
router.put(
  "/:id",
  [
    validationJWT,
    isAdminRole,
    check("amount", "amount is numeric").custom(amountExistsIsNumeric),
    check("date", "date is date()").custom(dateExistsIsDate),
    validatorDepositIdMongo,
    existDepositById,
    validationFields,
  ],
  depositPut
);

// Delete a deposit -  [ ADMINDB]
router.delete(
  "/:id",
  [
    validationJWT,
    isAdminRole,
    validatorDepositIdMongo,
    existDepositById,
    validationFields,
  ],
  depositDelete
);

module.exports = router;
