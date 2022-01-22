const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const PORT = 9001 || process.env.PORT;

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const categoryRoutes = require("./routes/categories");

app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDb connected successfully"))
  .catch((err) => console.log(err.message));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(req.body)
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded !");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/category", categoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
