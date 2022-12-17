const express = require ("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 4000;


app.use(express.json())
app.use(
  cors({
    origin: [
      "http://localhost:3000",
     "https://reactnotesfrontend.vercel.app"
    ]
  })
);
app.use("/api/note", require("./src/note"));
app.use("/api/user", require("./src/user"));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://Saurav:connectBabe@mydb.wqgpv.mongodb.net/?retryWrites=true&w=majority", ()=> {
  console.log("successfully connected")
})

app.listen(port, ()=> {
  console.log("listening on " + port)
})