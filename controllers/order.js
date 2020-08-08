const { Order, ProductCart } = require("../models/order");

//CUSTOM MIDDLEWARES
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "NO order found in DB",
        });
      }
      req.order = order;
      next();
    });
};

//ROUTES
//create order controller
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "FAILED to save order in DB",
      });
    }
    res.json(order);
  });
};

//get all the orders (for admin only)
exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: "No orders found in DB",
        });
      }
      res.json(orders);
    });
};

//to get the status of all the orders (for admin only)
exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

//to update the status of the order (for admin only)
exports.updateOrderStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, updatedOrder) => {
      if (err) {
        return res.status(400).json({
          error: "Cannot update the status of the order",
        });
      }
      res.json(updatedOrder);
    }
  );
};