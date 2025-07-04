const express = require("express");
const router = express.Router();
const homeController = require("../controller/HomeController");

router.get("/data", homeController.getHomeData);

module.exports = router;
