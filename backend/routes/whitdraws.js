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
  whitdrawGet,
  whitdrawIdGet,
  whitdrawPost,
  whitdrawPut,
  whitdrawDelete,
} = require("../controllers/whitdraw");

const {
  existWhitdrawByIdAndUser,
  validatorWhitdrawIdMongo,
  existWhitdrawById,
} = require("../validators/models");

const {
  amountExistsIsNumeric,
  dateExistsIsDate,
} = require("../validators/check");

const router = Router();

/**
 * {{url}}/api/whitdraws
 */

//  Get all whitdraws by useridJWT - [USER, DEV]
router.get(
  "/",
  [validationJWT, hasRoles(ROLES.DEV, ROLES.USER), validationFields],
  whitdrawGet
);

// Get a whitdraws id by useridJWT-  [USER, DEV]
router.get(
  "/:id",
  [
    validationJWT,
    hasRoles(ROLES.DEV, ROLES.USER),
    validatorWhitdrawIdMongo,
    existWhitdrawByIdAndUser,
    validationFields,
  ],
  whitdrawIdGet
);

// Create whitdraws by useridJWT -  [USER, DEV]
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
  whitdrawPost
);

// Update whitdraws -   [ADMINDB]
router.put(
  "/:id",
  [
    validationJWT,
    isAdminRole,
    check("amount", "amount is numeric").custom(amountExistsIsNumeric),
    check("date", "date is date()").custom(dateExistsIsDate),
    validatorWhitdrawIdMongo,
    existWhitdrawById,
    validationFields,
  ],
  whitdrawPut
);

// Delete a whitdraws -  [ ADMINDB]
router.delete(
  "/:id",
  [
    validationJWT,
    isAdminRole,
    validatorWhitdrawIdMongo,
    existWhitdrawById,
    validationFields,
  ],
  whitdrawDelete
);

module.exports = router;
