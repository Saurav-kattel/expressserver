const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  }
})

module.exports = new mongoose.model("user", userModel)