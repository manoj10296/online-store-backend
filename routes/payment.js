const express = require("express");
const router = express.Router();

const { getUserById } = require("../controllers/user");

const { isSignedIn, isAuthenticated } = require("../controllers/auth");

const { makeStripePayment } = require("../controllers/payment");

const { getToken, makeTransaction } = require("../controllers/payment");

router.param("userId", getUserById);

router.post("/payment/stripe", makeStripePayment);

router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);

router.post(
  "/payment/braintree/:userId",
  isSignedIn,
  isAuthenticated,
  makeTransaction
);

module.exports = router;