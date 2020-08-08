const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

//details of product to be shown in cart (for a single product only)
const productCartSchema = new mongoose.Schema(
  {
    product: {
      type: ObjectId,
      ref: "Product",
    },
    name: String,
    count: Number,
    price: Number,
  },
  { timestamps: true }
);

const ProductCart = mongoose.model("ProductCart", productCartSchema);

//at the time of order details to be stored in db (of all the products)
const orderSchema = new mongoose.Schema(
  {
    products: [productCartSchema], //to reterive all the product added in cart that user want to buy
    transaction_id: {},
    amount: Number,
    address: String,
    updated: Date,
    staus: {
      type: String,
      default: "Received",
      enum: ["Cancelled", "Shipped", "Delivered", "Processing", "Received"],
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart };