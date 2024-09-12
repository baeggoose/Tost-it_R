const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/check-session", authController.checkSession);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/register", authController.registerUser);

module.exports = router;
