const express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const { signin, signup, signout, isSignedIn } = require("../controllers/auth");

//signup router
router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("Name should be atleast 3 characters"),
    check("email").isEmail().withMessage("Enter a valid email id"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password should be atleast 5 characters long"),
  ],
  signup
);

//signin router
router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Enter a valid email id"),
    check("password")
      .isLength({ min: 3 })
      .withMessage("Password field is required"),
  ],
  signin
);

//signout router
router.get("/signout", signout);

module.exports = router;