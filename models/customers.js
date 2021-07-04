const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  balance: Number,
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
