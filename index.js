const express = require ("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 4000;
app.use(express.json())
app.use("/api/note", require("./src/note"));
app.use("/api/user", require("./src/user"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://Saurav:connectBabe@mydb.wqgpv.mongodb.net/?retryWrites=true&w=majority",()=>{
  console.log("successfully connected")
})

app.listen(port,()=>{
  console.log("listening on " + port)
})