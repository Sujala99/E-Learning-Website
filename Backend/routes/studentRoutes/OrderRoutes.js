const express = require("express");
const orderController = require("../../controller/studentController/OrderController");

const router = express.Router();

router.post("/khalti/init", orderController.initKhaltiOrder);
router.post("/khalti/verify", orderController.verifyKhaltiPayment);
router.post("/simulate-payment-success", orderController.simulatePaymentSuccess);

module.exports = router;
