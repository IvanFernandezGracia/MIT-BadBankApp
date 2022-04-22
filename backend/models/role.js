const { Schema, model } = require("mongoose");
// {
//   role: "USER";
// }

const RoleSchema = Schema({
  role: {
    type: String,
    required: [true, "The role is required"],
    unique: true,
  },
});

RoleSchema.methods.toJSON = function () {
  const { __v, ...role } = this.toObject();
  return role;
};

module.exports = model("Role", RoleSchema);
