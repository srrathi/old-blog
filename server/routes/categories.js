const router = require("express").Router();
const Category = require("../models/Category");

router.post("/create", async (req, res) => {
  const newCat = new Category(req.body);
  try {
    const savedCategory = await newCat.save();
    return res.status(200).json(savedCategory);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/allCategories", async (req, res) => {
  try {
    const cats = await Category.find();
    return res.status(200).json(cats);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
