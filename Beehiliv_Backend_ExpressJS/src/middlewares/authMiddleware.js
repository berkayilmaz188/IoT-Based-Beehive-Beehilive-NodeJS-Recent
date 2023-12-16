const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


const ensurenotAuthenticated = async(req, res, next) => {
  if(req.headers.authorization !== undefined){
    console.log("calisiyor")
    const token = req.headers.authorization.split("Bearer ")[1];
    var user = jwt.verify(token, "secret_key", (err, result) => {
      if (err) {
      } else {
        return result;
      }
    });
  }else{
      console.log("Beehiliv")
  }
  if (user) {
    res.json({
      error: {
        message: "you are already logged in",
      },
    });
  } else {
    next();
  }
};

const ensureAuthenticated = async (req, res, next) => {

  if(req.headers.authorization !== undefined){
    const token = req.headers.authorization.split("Bearer ")[1];

    var user = jwt.verify(token, "secret_key", (err, result) => {
    if (err) {
    } else {
      return result;
    }
  });
}

if(user){

  var {userName,password,email} = user.user;
}

const verifyUser = await User.findOne({userName:userName,password:password,email:email});

  if (verifyUser) {
    next();
  } else {
    res.json({
      error: {
        message: "you are not authorized",
      },
    });
  }
};

module.exports = {
  ensureAuthenticated,
  ensurenotAuthenticated,
};
