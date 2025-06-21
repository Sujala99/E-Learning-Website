const express = require("express");
const studentCoursesController = require("../../controller/studentController/CoursesController");
// const instructorInstructorController = require("../../controller/instructorController/coursesController");

const router = express.Router();



router.get("/getCourses", studentCoursesController.getAllStudentViewCourses);
router.get("/get/details/:id", studentCoursesController.getStudentViewCourseDetails);
router.get("/purchase-info/:id/:studentId", studentCoursesController.checkCoursePurchaseInfo);

module.exports = router;
