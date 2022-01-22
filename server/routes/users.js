const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

// UPDATE
router.put("/update/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(401).json("Not Authorized");
  }
});

// DELETE
router.delete("/delete/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json("User has been deleted successfully !");
      } catch (error) {
        return res.status(500).json(error);
      }
    } catch (error) {
      return res.status(500).json("User not found !");
    }
  } else {
    return res.status(401).json("Not Authorized");
  }
});

// GET
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    delete user._doc["password"];
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
