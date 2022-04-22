const { Schema, model } = require("mongoose");
// {
//  active: "true"
//  balance: "123123";
//  user: User();
// }

const stateAccountSchema = Schema({
  active: {
    type: Boolean,
    required: [true, "The active is required"],
  },
  balance: {
    type: Number,
    required: [true, "The balance is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The user is required"],
    unique: true,
  },
});

stateAccountSchema.methods.toJSON = function () {
  const { __v, user, _id, ...stateAccount } = this.toObject();
  return stateAccount;
};

module.exports = model("StateAccount", stateAccountSchema);
