const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
} = require("../controllers/user");
const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");

//param to get userId from databse into the params of url
router.param("userId", getUserById);

//CREATE route
//to show all the required data to the user after checking for authentication of user
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

//router to show all the orders of a particular user
router.get(
  "/user/:userId/orders",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);

//UPDATE route
//to allow user to update in his/her profile after checking for authentication of user
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

module.exports = router;