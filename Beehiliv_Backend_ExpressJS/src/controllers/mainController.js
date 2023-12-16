const { response } = require("express");
//const {validationResult} = require('express-validator');
const passport = require("passport");
require("../config/passport");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
//const nodemailer = require('nodemailer');

const showMainPage = async (req, res, next) => {
  res.json({
    status: "successful",
  });
};

const login = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    const user = await User.findOne({
      $or: [{ userName: userName }, { email: email }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorrect username, email, or password." });
    }
    if (!user.isVerified) {
      return res.status(400).json({
        message: "your account is not verified",
      });
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        const token = jwt.sign({ user }, "secret_key");
        res.json({ user, token });
      } else {
        res
          .status(400)
          .json({ message: "Incorrect username, email, or password." });
      }
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const register = async (req, res, next) => {
  const isUnique = await User.findOne({
    $or: [
      { userName: req.body.userName },
      { email: req.body.email },
      { firstName: req.body.firstName },
      { lastName: req.body.lastName },
      {phoneNumber: req.body.phoneNumber}
    ],
  });
  console.log(isUnique)

  if (isUnique === null) {
    var newUser = new User();

    await bcrypt.hash(req.body.password, 10, function (err, hash) {
      // Store hash in the database
      newUser.userName = req.body.userName;
      newUser.password = hash;
      newUser.email = req.body.email;
      newUser.firstName = req.body.firstName;
      newUser.lastName = req.body.lastName;
      newUser.isVerified = false;
      newUser.phoneNumber = req.body.phoneNumber;
      newUser.hives = {};
      console.log("yeni kullanici: ", newUser);
      newUser.save();
      res.json(newUser);
    });

    const jwtData = {
      username: req.body.userName,
      email: req.body.email,
    };

    const secretKey = "secret_key" + "-" + req.body.email;
    const jwtTokenVerify = jwt.sign(jwtData, secretKey, { expiresIn: "1d" });
    const jwtTokenFirst = jwt.sign(req.body.email, "secret_key");
    const url =
      "http://www.beehiliv.com.tr:4000/" +
      "verify/" +
      jwtTokenFirst +
      "/" +
      jwtTokenVerify;
    console.log("gidilecek url: " + url);

    //Mail Gonderme Islemleri

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "teambeehiliv@gmail.com",
        pass: "csxhlpfmstrzrrrg",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    await transporter.sendMail(
      {
        from: "BEEHİVE HESAP DOĞRULAMA <teambeehive@gmail.com>",
        to: req.body.email,
        subject: "Hesap Doğrulama",
        text: "Hesabinizi doğrulamak için lütfen tikalyiniz: " + url,
      },
      (error, info) => {
        if (error) {
          console.log("Mail sending Error: :" + +error);
        } else {
          console.log("Mail Gonderildi");
          //console.log(info);
          transporter.close();
        }
      }
    );
  } else {
    res.json({
      message: "this username or mail is already taken",
    });
  }
};

const verify = async (req, res) => {
  const userMail = await jwt.verify(req.params.mail, "secret_key");

  const jwtDataSecret = "secret_key" + "-" + userMail;
  const jwtData = await jwt.verify(req.params.jwt, jwtDataSecret);
  console.log(jwtData);

  const user = await User.findOne({ userName: jwtData.username });
  if (user.isVerified === false) {
    user.isVerified = true;
    user.save();
    res.json({
      message: "your account is verified",
    });
  } else {
    res.json({
      message: "you are already verified your account",
    });
  }
};

const change = async (req, res) => {
  var tokenuserr;
  const token = req.headers.authorization.split("Bearer ")[1];
  jwt.verify(token, "secret_key", (err, result) => {
    if (err) {
    } else {
      tokenuserr = result;
    }
  });

  const UserObject = await User.findOne({ userName: tokenuserr.user.userName });
  var userName = UserObject.userName;
  var password = UserObject.password;
  var email = UserObject.email;
  var phoneNumber = UserObject.phoneNumber;
  var firstName = UserObject.firstName;
  var lastName = UserObject.lastName;


  console.log(req.body);
  if (req.body.userName) {
    userName = req.body.userName;
  } else {
    userName = UserObject.userName;
  }
  if (req.body.firstName) {
    firstName = req.body.firstName;
  } else {
    firstName = UserObject.firstName;
  }
  if (req.body.lastName) {
    lastName = req.body.lastName;
  } else {
    lastName = UserObject.lastName;
  }
  if (req.body.email) {
    email = req.body.email;
  } else {
    email = UserObject.email;
  }
  if(req.body.phoneNumber){
    phoneNumber = req.body.phoneNumber;
  }else{
    phoneNumber = UserObject.phoneNumber;
  }
  if (!req.body.password) {
    password = UserObject.password;
    await User.findOneAndUpdate(
      { userName: tokenuserr.user.userName },
      { userName: userName, email: email, password: password}
    );
  } else {
    console.log("bcrypt calisiyor");
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      password = hash;
      console.log(req.body.password);
      console.log(password);
      await User.findOneAndUpdate(
        { userName: tokenuserr.user.userName },
        { userName: userName, email: email, password: password}
      );
    });
  }

  await User.findOneAndUpdate(
    { userName: tokenuserr.user.userName },
    { userName: userName, email: email, password: password,firstName:firstName,lastName:lastName,phoneNumber:phoneNumber  }
  );
  const newUser = await User.findOne({ userName: userName });

  res.json({
    message: "succesful",
    newUser,
  });
};

const sendPasswordReset = async (req, res) => {
  const mailAddress = req.body.email;

  const jwtMail = jwt.sign({ email: mailAddress }, "secret_key");

  const resetLink = "http://www.beehiliv.com.tr/passwordreset/" + jwtMail;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "teambeehiliv@gmail.com",
      pass: "csxhlpfmstrzrrrg",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  await transporter.sendMail(
    {
      from: "BEEHIVE SIFRE SIFIRLAMA <teambeehive@gmail.com>",
      to: mailAddress,
      subject: "SİFRE SIFIRLAMA",
      text:
        "Hesabinizin sifresini sifirlamak için lütfen tiklayiniz: " + resetLink,
    },
    (error, info) => {
      if (error) {
        console.log("Mail sending Error: :" + +error);
        res.json({ error: error });
      } else {
        res.json({ message: "success" });
        console.log("Mail Gonderildi");
        //console.log(info);
        transporter.close();
      }
    }
  );
};

const resetPassword = async (req, res) => {
  var email = "";
  jwt.verify(req.params.token, "secret_key", (err, result) => {
    if (err) {
    } else {
      email = result.email;
    }
  });

  bcrypt.hash(req.body.newPassword, 10, async (err, hash) => {
    await User.findOneAndUpdate({ email: email }, { password: hash });
  });

  res.json({
    message: "successful",
  });
};

const getLog = async (req,res) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  var user = jwt.verify(token, "secret_key");
  user = user.user;
  const hives = user.hives;
  
  if(hives){
    res.json(
      hives
    )
  }else{
    res.json({
      message:"log are not exist"
    })
  }
}

module.exports = {
  showMainPage,
  login,
  register,
  verify,
  change,
  sendPasswordReset,
  resetPassword,
  getLog
};
