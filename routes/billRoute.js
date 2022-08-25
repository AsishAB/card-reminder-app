const express = require("express");
const path = require("path");
const router = express.Router();

const BillController = require("../controllers/BillController");

router.get("/add-billreminder", BillController.getAddCardReminder);
router.post("/add-billreminder", BillController.addCardReminder);
router.get("/card-list", BillController.getCardList);
// router.post("/view-card", BillController.viewCard);
router.get("/view-card/:cardId", BillController.viewCard);
router.delete("/delete-card/:cardId", BillController.deleteCard);

module.exports = router;
