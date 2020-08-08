const User = require("../models/user");
const { validationResult } = require("express-validator");

var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

//signup controller
exports.signup = (req, res) => {
  const errors = validationResult(req);
  //to check for validations on the input
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      parameter: errors.array()[0].param,
    });
  }

  const user = new User(req.body);
  console.log(user)
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

//signin controller
exports.signin = (req, res) => {
  const errors = validationResult(req);
  //to check for validations on the input
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      parameter: errors.array()[0].param,
    });
  }

  const { email, password } = req.body;

  //to match email from database
  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Cannot get a response from server",
      });
    }
    if (!user) {
      return res.status(400).json({
        error: "User does not exist",
        parameter: "email",
      });
    }

    //to check for the password
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Invalid Password",
        parameter: "password",
      });
    }

    //if the user is valid
    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

//signout controller
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    meassage: "User signout successfully",
  });
};

//protected route to check for jwt stored inside the browser
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ['HS256']
});

//custom middlewares
//to check for authentication of user
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

//to check for admin previlages of user
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    res.status(403).json({
      error: "You are not ADMIN, ACCESS DENIED",
    });
  }
  next();
};