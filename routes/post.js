const express = require("express");
const PostController = require("../controllers/postController");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/create", upload.array("media"), PostController.createPost);
router.get("/all", PostController.getPosts);
router.get("/get", PostController.getPost);

module.exports = router;
