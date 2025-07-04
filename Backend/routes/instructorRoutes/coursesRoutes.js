// const express = require("express");
// const instructorInstructorController = require("../../controller/instructorController/coursesController")

// const router = express.Router();

// router.post("/add", instructorInstructorController.addNewCourse);
// router.get("/get", instructorInstructorController.getAllCourses);
// router.get("/get/details/:id", instructorInstructorController.getCourseDetailsByID);
// router.put("/update/:id", instructorInstructorController.updateCourseByID);

// module.exports = router;


const express = require("express");
const instructorInstructorController = require("../../controller/instructorController/coursesController");
const { authenticateToken,authorizeRole } = require("../../Security/Auth");  // Adjust path as needed

const router = express.Router();

router.post("/add", authenticateToken, instructorInstructorController.addCourse);
router.get("/get", authenticateToken, instructorInstructorController.getAllCourses);
router.get("/get/details/:id", instructorInstructorController.getCourseDetailsByID); //get details of course
router.put("/update/:id", authenticateToken, instructorInstructorController.updateCourseByID);

router.get("/mycourse", authenticateToken, instructorInstructorController.getInstructorCourses); //get course of instructor by instructor id
router.delete("/delete/:id", authenticateToken, instructorInstructorController.deleteCourseByID);

module.exports = router;
