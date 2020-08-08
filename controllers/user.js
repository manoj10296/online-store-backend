const User = require("../models/user");
const Order = require("../models/order");

//controller to return all the information of user whose user id is passed in params of req
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user is found in db",
      });
    }
    req.profile = user;
    next();
  });
};

//controller to show only the required information to the user
exports.getUser = (req, res) => {
  //to disable the unnecassary information to be displayed to user (like salt & password)
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

//controller to update a specific user
exports.updateUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this user",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      res.json(user);
    }
  );
};

//controller to show all the orders of specific user
exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: "No orders in this account",
        });
      }
      return res.json(orders);
    });
};

//custom middleware to update purchase list when user places any new order
exports.pushOrderInPurchaseList = (req, res) => {
  //looping through the items received through res and placing the details in purchase_list
  let purchase_list = [];
  req.body.order.products.forEach((product) => {
    purchase_list.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //store and update these details in user DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchase_list: purchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to update the user purchase list",
        });
      }
      next();
    }
  );
};