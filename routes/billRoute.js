const express = require("express");
const path = require("path");
const router = express.Router();

const BillController = require("../controllers/BillController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

router.get(
	"/add-billreminder",
	AuthMiddleware,
	BillController.getAddCardReminder
);
router.post(
	"/add-billreminder",
	AuthMiddleware,
	BillController.addCardReminder
);
router.get("/card-list", AuthMiddleware, BillController.getCardList);
// router.post("/view-card", BillController.viewCard);
router.get("/view-card/:cardId", AuthMiddleware, BillController.viewCard);
router.delete(
	"/delete-card/:cardId",
	AuthMiddleware,
	BillController.deleteCard
);

module.exports = router;
