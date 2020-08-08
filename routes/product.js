const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  getPhoto,
  removeProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//PARAMS
router.param("userId", getUserById);
router.param("productId", getProductById);

//CREATE route
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

//READ route
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", getPhoto);

//UPDATE route
router.put(
  "/product/update/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

//DELETE route
router.delete(
  "/product/delete/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeProduct
);

//LISTING routes
router.get("/products", getAllProducts);
router.get("/products/categories", getAllUniqueCategories);

module.exports = router;