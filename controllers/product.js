const Product = require("../models/product");
const formidable = require("formidable"); //to handle multipart form data (image upload just like multer)
const fs = require("fs");
const _ = require("lodash");
// const { validationResult } = require("express-validator");

//CUSTOM MIDDLEWARES
//to find the product on the basis of id so that admin can perform specific operations on the product
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

//to return photo in res explicitally
exports.getPhoto = (req, res) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

//CONTROLLERS
//to create a product
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; //to save extensions of file in DB

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with the image",
      });
    }

    //destructure the fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let product = new Product(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        //to check for file greater than 3mb
        return res.status(400).json({
          error: "File size is too big!!",
        });
      }
      //saving photo in DB
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(422).json({
    //     error: errors.array()[0].msg,
    //     parameter: errors.array()[0].param,
    //   });
    // }
    //save to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Saving product in DB FAILED",
        });
      }
      res.json(product);
    });
  });
};

//to get the product
exports.getProduct = (req, res) => {
  req.product.photo = undefined; //to disable photo to return in res
  return res.json(req.product);
};

//to update the product
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; //to save extensions of file in DB

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with the image",
      });
    }

    //updation code
    let product = req.product;
    product = _.extend(product, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        //to check for file greater than 3mb
        return res.status(400).json({
          error: "File size is too big!!",
        });
      }
      //saving photo in DB
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(product);
    });
  });
};

//to delete the product
exports.removeProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to DELETE the product",
      });
    }
    res.json({
      message: "Product was deleted successfully",
      deletedProduct,
    });
  });
};

//to list all the products
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo") //to disable photo to get selected
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No PRODUCT find",
        });
      }
      res.json(products);
    });
};

//to list all the unique categorties of the products
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found",
      });
    }
    res.json(categories);
  });
};

//to update the stock
exports.updateStock = (req, res) => {
  let myOperations = req.body.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk write operations on PRODUCT FAILED",
      });
    }
    next();
  });
};