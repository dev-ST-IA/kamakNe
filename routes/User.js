const express = require("express");
const AuthController = require("../controllers/AuthController");
const router = express.Router();
const authMiddleWare = require("../middlewares/auth");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

module.exports = router;
