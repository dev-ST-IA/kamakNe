const express = require("express");
const AuthController = require("../controllers/AuthController");
const router = express.Router();
const authMiddleWare = require("../middlewares/auth");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/registerAdmin", AuthController.registerAdmin);
router.post("/loginAdmin", AuthController.loginAdmin);

module.exports = router;
