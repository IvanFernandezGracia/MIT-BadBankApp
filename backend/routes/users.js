const { Router } = require("express");
const { check } = require("express-validator");

const {
  validationFields,
  validationJWT,
  isAdminRole,
} = require("../middlewares");

const {
  isRoleValid,
  emailExist,
  existUserById,
} = require("../validators/check");

const {
  userGet,
  userPut,
  userPost,
  userDelete,
  searchUser,
} = require("../controllers/user");

const router = Router();

/**
 * {{url}}/api/users
 */

//  Get all users - [USER]
router.get("/", validationJWT, userGet);

//  Create user - [DB_ADMIN]
router.post(
  "/",
  [
    validationJWT,
    isAdminRole,
    check("name", "The name is required").not().isEmpty(),
    check("password", "Password must be more than 6 letters").isLength({
      min: 6,
    }),
    check("email", "The email is invalid").isEmail(),
    check("email").custom(emailExist),
    check("id_role", "Not a valid ID").isMongoId(),
    check("id_role").custom(isRoleValid),
    validationFields,
  ],
  userPost
);

//  Update user by id - [DB_ADMIN]
router.put(
  "/:id",
  [
    validationJWT,
    isAdminRole,
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(existUserById),
    check("email", "Email is not Modificate").isEmpty(),
    validationFields,
  ],
  userPut
);

//  Delete user - [DB_ADMIN]
router.delete(
  "/:id",
  [
    validationJWT,
    isAdminRole,
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(existUserById),
    validationFields,
  ],
  userDelete
);

//Search All user by id or term (name or email)
router.get("/:term", validationJWT, searchUser);

module.exports = router;
