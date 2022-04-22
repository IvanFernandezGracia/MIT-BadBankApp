const { Schema, model } = require("mongoose");
var moment = require("moment");

// {
//   date: "13:12:34-22-06-2022";
//   amount: "ivan.fern.g@usach.cl";
//   from: {Schema User IDMongo};
//   to: {Schema User IDMongo};
// }

const PaymentSchema = Schema({
  date: {
    type: Date,
    required: [true, "The date is required"],
  },
  amount: {
    type: Number,
    required: [true, "The amount is required"],
    default: 0,
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The user is required"],
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The user is required"],
  },
});

PaymentSchema.methods.toJSON = function () {
  const { __v, _id, date, from, to, ...data } = this.toObject();
  data.date = moment(date).format("YYYY-MM-DD HH:mm:ss");
  data.uid = _id;
  return data;
};

module.exports = model("Payment", PaymentSchema);
