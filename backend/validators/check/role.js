const { Role } = require("../../models");

const isRoleValid = async (id_role = "") => {
  const existRole = await Role.findOne({ _id: id_role });
  if (!existRole) {
    throw new Error(`The role ${id_role} is not registered in the DB`);
  }
};

module.exports = {
  isRoleValid,
};
