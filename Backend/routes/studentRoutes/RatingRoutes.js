const express = require("express");
const router = express.Router();

const ratingController = require("../../controller/studentController/RatingController");
const { authenticateToken } = require("../../Security/Auth");


router.post("/rate", authenticateToken, ratingController.addOrUpdateRating);
router.get("/my/:courseId", authenticateToken, ratingController.getMyRating);

router.get("/stats/:courseId", ratingController.getCourseRatingStats);

module.exports = router;
