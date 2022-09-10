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

router.get(
	"/edit-bankaccount/:bankAccountId",
	AuthMiddleware,
	BankAccountController.editBankAccount
);

router.post(
	"/add-bankaccount",
	AuthMiddleware,
	BankAccountController.addBankAccount
);

router.get(
	"/view-bankaccount/:bankAccountId",
	AuthMiddleware,
	BankAccountController.viewBankAccount
);

router.delete(
	"/delete-bankaccount/:bankAccountId",
	AuthMiddleware,
	BankAccountController.deleteBankAccount
);

router.get(
	"/exportToExcel",
	AuthMiddleware,
	BankAccountController.exportToExcel
);

module.exports = router;
