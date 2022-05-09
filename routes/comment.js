const express = require("express");
const CommentsController = require("../controllers/commentsController");
const router = express.Router();

router.post("/create", CommentsController.createComment);
router.get("/all", CommentsController.getComments);
router.get("/get", CommentsController.getComment);

module.exports = router;
