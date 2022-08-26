const express = require("express");

const router = express.Router();

const BankController = require("../controllers/BankController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const MulterMiddleware = require("../middlewares/MulterMiddleware");

router.get("/add-bank", AuthMiddleware, BankController.getAddBank);
router.post(
	"/add-bank",
	AuthMiddleware,
	MulterMiddleware("bankImage"),
	BankController.addBank
);
router.get("/bank-list", AuthMiddleware, BankController.getBankList);

module.exports = router;
