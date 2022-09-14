const express = require("express");
const path = require("path");
const router = express.Router();

const EWalletController = require("../controllers/EWalletController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

router.get(
	"/add-billreminder",
	AuthMiddleware,
	EWalletController.getAddCardReminder
);
router.post(
	"/add-billreminder",
	AuthMiddleware,
	EWalletController.addCardReminder
);

router.get("/edit-card/:cardId", AuthMiddleware, EWalletController.editCard);
router.get("/card-list", AuthMiddleware, EWalletController.getCardList);

router.get("/view-card/:cardId", AuthMiddleware, EWalletController.viewCard);

router.delete(
	"/delete-card/:cardId",
	AuthMiddleware,
	EWalletController.deleteCard
);

router.get("/exportToExcel", AuthMiddleware, EWalletController.exportToExcel);

// router.post("/exportToExcel", AuthMiddleware, EWalletController.exportToExcel);

module.exports = router;
