const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPass,
    });
    const user = await newUser.save();
    delete user._doc["password"];
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json("Wrong Credentials");
    }
    const validate = await bcrypt.compare(password, user.password);
    if (!validate) {
      return res.status(400).json("Invalid Password, Please try again !");
    }

    const userData = { ...user._doc };
    delete userData["password"];

    return res.status(200).json(userData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
