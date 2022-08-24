const express = require("express");

const router = express.Router();

const BankController = require("../controllers/BankController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const MulterMiddleware = require("../middlewares/MulterMiddleware");

router.get("/add-bank", BankController.getAddBank);
router.post("/add-bank", MulterMiddleware("bankImage"), BankController.addBank);
router.get("/bank-list", BankController.getBankList);

module.exports = router;
