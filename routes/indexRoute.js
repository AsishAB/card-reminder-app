const express = require("express");
const path = require("path");
const router = express.Router();

const IndexController = require("../controllers/IndexController");

router.get("/", IndexController.indexPage);

module.exports = router;
