const mongoose = require("mongoose");

const noteModel = new mongoose.Schema({
  userId:{
    type: String
  },
  title: {
    type: String,
    require: true
  },
 description:{
   type: String,
 },
 tag: {
   type: String,
   require: true
 },
 date: {
   type: Date,
   default: Date.now
 }
})

module.exports = new mongoose.model("note", noteModel)