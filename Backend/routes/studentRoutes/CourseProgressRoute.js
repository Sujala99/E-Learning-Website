const express = require("express");
const CourseProgress = require("../../controller/studentController/CourseProgressController")
const router = express.Router();

router.get("/get/:userId/:courseId", CourseProgress.getCurrentCourseProgress);
router.post("/mark-lecture-viewed", CourseProgress.markCurrentLectureAsViewed);
router.post("/reset-progress", CourseProgress.resetCurrentCourseProgress);
module.exports = router;
