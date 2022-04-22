const { response } = require("express");
const { ROLES } = require("../database/mongoConfig");

const isAdminRole = (req, res = response, next) => {
  if (!req.userData) {
    return res.status(500).json({
      msg: "You want to verify the role without validating the token first",
    });
  }

  const { role, name } = req.userData;

  if (!role.equals(ROLES.DB_ADMIN)) {
    return res.status(401).json({
      msg: `${name} is not admin - can't do this`,
    });
  }

  next();
};

const hasRoles = (...roles) => {
  return (req, res = response, next) => {
    if (!req.userData) {
      return res.status(500).json({
        msg: "You want to verify the role without validating the token first",
      });
    }

    if (
      !(
        roles.findIndex((role) => {
          return role.equals(req.userData.role);
        }) >= 0
      )
    ) {
      return res.status(401).json({
        msg: `The server requires one of these roles ${roles.map(
          (r) => r.role
        )}`,
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  hasRoles,
};
