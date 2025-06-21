// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const cartController = require("../../controller/studentController/CartController");

router.post("/add", cartController.addToCart);
router.get("/:studentId", cartController.getCart);
router.post("/remove", cartController.removeFromCart);

module.exports = router;
