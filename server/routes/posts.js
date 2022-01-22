const router = require("express").Router();
const Post = require("../models/Post");

// CREATE NEW POST
router.post("/create", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// UPDATE POST
router.put("/update/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        return res.status(500).json(error);
      }
    } else {
      return res.status(500).json("User not Authorized");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// DELETE POST
router.delete("/delete/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("Post has been deleted !");
      } catch (error) {
        return res.status(500).json(error);
      }
    } else {
      return res.status(500).json("User not Authorized");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET POST
router.get("/fetch/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET ALL POSTS
router.get("/allPosts", async (req, res) => {
  const username = req.query.user;
  const category = req.query.category;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (category) {
      posts = await Post.find({
        categories: {
          $in: [category],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
