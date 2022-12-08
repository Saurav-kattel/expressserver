const express = require("express");
const router = express.Router();
const userModel = require("./schema/userModel");
const {
  body,
  validationResult
} = require('express-validator');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const JWT_SEC = "SECRET${KEY}"
const jwt = require("jsonwebtoken");
const fetchUser = require("./middlewares/fetchUser");
//for creating user api endpoint http://localhost:4000/api/user/signup
router.post("/signup", [
  // name must be  3  chars long
  body("name").isLength( {
    min: 3
  }),
  //email must be an email
  body('email').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({
    min: 5
  })], async (req, res)=> {
  try {
    const errors = validationResult(req);
    //checks if user already exists

    let ifUser = await userModel.findOne({
      email: req.body.email
    });

    //if there is any errors from clinet side  returns errors array
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    //return error if user is already  signed up
    if (ifUser) {
      return res.status(401).json({
        err: true,
        msg: "user exists"
      })
    }
    // hashing password
    const hash = bcrypt.hashSync(req.body.password, salt);
    // creates a user based on schema and saves on database

    userModel.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }).then(async (response)=> {
      let user = await userModel.findOne({
        email: req.body.email
      });
      console.log(user);
      let token = await jwt.sign(user.id, JWT_SEC);
      res.status(200).json({
        msg: "success",
        token: token
      })
    });

  }catch(err) {
    return res.status(500).json({
      err: err
    });
  }
  //sends email to user after successfully sigining in
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kattelsaurav32@gmail.com',
        pass: 'nwbxowurdekxqcrn'
      }
    });

    var mailOptions = {
      from: 'kattelsaurav32@gmail.com',
      to: `${req.body.email}`,
      subject: 'Signup',
      text: 'Thanks for signing in. signin  sucessfull'
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return res.status(500).json({
          err: error
        });
      }
    });
  }catch(err) {
    return res.status(500).json({
      err: err
    });
  }
})


//for login ... http://localhost/4000/api/user/getuser

try {
  router.get("/getuser", fetchUser, async(req,
    res)=> {
    let id = req.user;
    //to find user from database using id
    let data = await userModel.findById(id).select("-password");

    res.status(200).json({
      data
    })
  })
}catch(err) {
  console.log(err);
}

// user login endpoint

try {
  router.post("/login", async(req,
    res)=> {

    let user = await userModel.findOne({
      email: req.body.email
    });
    if (!user) {
      res.status(401).json({
        msg: "user doesn't exist"
      })
    }
    let passCheck = await bcrypt.compare(req.body.password, user.password);
    if (!passCheck) {
      return res.status(401).json({
        msg: "invalid password"
      });
    };
    let token = await jwt.sign(user.id, JWT_SEC);
    res.status(200).json({
      msg: "success",
      token: token
    })
  })
}catch(err) {
  console.log(err);
}
module.exports = router;