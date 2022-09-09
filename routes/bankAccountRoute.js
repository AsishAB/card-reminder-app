const express = require("express");
const path = require("path");
const router = express.Router();

const BankAccountController = require("../controllers/BankAccountController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

router.get(
	"/bankaccount-list",
	AuthMiddleware,
	BankAccountController.getBankAccountList
);
router.get(
	"/add-bankaccount",
	AuthMiddleware,
	BankAccountController.getAddBankAccountList
);

router.post(
	"/add-bankaccount",
	AuthMiddleware,
	BankAccountController.addBankAccount
);

module.exports = router;
