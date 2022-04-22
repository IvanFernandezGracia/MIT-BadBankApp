const { Schema, model } = require("mongoose");
// const { ROLES } = require("../database/config");

// {
//   name: "ivan";
//   email: "ivan.fern.g@usach.cl";
//   password: "1234123123";
//   url_image: "url hhttp";
//   role: {Schema Role IDMongo};
// }

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
  },
  email: {
    type: String,
    required: [true, "The email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "The password is required"],
  },
  url_image: {
    type: String,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: [true, "The role is required"],
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, role, _id, ...user } = this.toObject();
  // user.uid = _id;
  return user;
};

module.exports = model("User", UserSchema);
