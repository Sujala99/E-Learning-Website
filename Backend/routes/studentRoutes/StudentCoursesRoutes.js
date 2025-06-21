const express = require("express");
const studentCoursesroute= require("../../controller/studentController/studentCoursesController");
const router = express.Router();

router.get("/get/:studentId", studentCoursesroute.getCoursesByStudentId);

module.exports = router;
