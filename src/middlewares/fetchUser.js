const express = require("express");
const JWT_SEC = "SECRET${KEY}"
const jwt = require("jsonwebtoken");

const fetchUser = async (req,res ,next)=>{
  const token = req.header("auth");
  try{
  if(!token){
    return res.status(401).json({msg: "user not found"});
  }
  let data = jwt.verify(token, JWT_SEC);
  req.user = data;
next();
}catch(err){
  res.status(500).send("Error occurred");
}
}

module.exports = fetchUser;