const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Category is not found in DB",
      });
    }
    req.category = category;
    next();
  });
};

//controller to create the category (for admin only)
exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NOT able to create category in DB",
      });
    }
    res.json({ category });
  });
};

//to return a specific category based on the id passed
exports.getCategory = (req, res) => {
  return res.json(req.category); //getCategoryById is doing all the job for us
};

//to return all the categories stored in DB
exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "hello",
      });
    }
    res.json(categories);
  });
};

//controller to update any particular category
exports.updateCategory = (req, res) => {
 console.log(req.body, res)
  Category.findOneAndUpdate({
     _id: req.category._id },
    { $set: { name: req.body.name } },(err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update the category",
      });
    }
    res.json(updatedCategory);
  });
};

//controller to delete any category
exports.deleteCategory = (req, res) => {
  const category = req.category;
  category.remove((err, deletedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete this category",
      });
    }
    res.json({
      message: `${deletedCategory} is deleted`,
    });
  });
};