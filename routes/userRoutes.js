const express = require("express");

const router = express.Router();

const UserController = require("../controllers/UserController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

// router.get("/login", UserController.getLoginPage);

// router.post("/loginUser", UserController.loginUser);

// router.get("/dashboard", AuthMiddleware, UserController.getUserDashboard);

// router.post("/logout", AuthMiddleware, UserController.logoutUser);

router.get("/register", UserController.getRegisterPage);

router.post("/register-user", UserController.registerUser);

// router.get("/reset-password", UserController.getResetPassword);

// router.post("/reset-password", UserController.resetPassword);

// router.get("/update-password", UserController.getUpdatePassword);

// router.post("/update-password", UserController.updatePassword);

module.exports = router;
