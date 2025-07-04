const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require("../../Security/cloudinary");

// const User = require("../models/userModels");
const Course = require("../../models/coursesModels");


// Upload video/image to Cloudinary
exports.uploadMedia = async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    res.status(200).json({ success: true, data: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};


exports.addCourse = async (req, res) => {
  try {
    const { id: instructorId, username: instructorName, role } = req.user;

    if (role !== "instructor") {
      return res.status(403).json({ message: "Only instructors can add courses." });
    }

    const {
      title,
      description,
      pricing,
      image,
      objectives,
      welcomeMessage,
      curriculum,
      date,
      isPublished,
      category,
      level,
      primaryLanguage,
      subtitle,
    } = req.body;

    const newCourse = new Course({
      title,
      description,
      pricing,
      image,
      objectives,
      welcomeMessage,
      curriculum,
      instructorId,
      instructorName,
      date,
      isPublished,
      category,
      level,
      primaryLanguage,
      subtitle,
    });

    const savedCourse = await newCourse.save();

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

exports.getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

exports.updateCourseByID = async (req, res) => {
  try {
    const { id: instructorId, role } = req.user;
    const { id } = req.params;

    if (role !== "instructor") {
      return res.status(403).json({ message: "Only instructors can update courses." });
    }

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found." });
    if (course.instructorId !== instructorId) {
      return res.status(403).json({ message: "Unauthorized: You do not own this course." });
    }

    const updated = await Course.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed." });
  }
};


exports.getInstructorCourses = async (req, res) => {
  try {
    const { id: instructorId, role } = req.user;

    if (role !== "instructor") {
      return res.status(403).json({ message: "Only instructors can view their courses." });
    }

    const courses = await Course.find({ instructorId });
    res.status(200).json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching courses" });
  }
};


exports.deleteCourseByID = async (req, res) => {
  try {
    const { id: instructorId, role } = req.user;
    const { id } = req.params;

    if (role !== "instructor") {
      return res.status(403).json({ message: "Only instructors can delete courses." });
    }

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found." });
    if (course.instructorId !== instructorId) {
      return res.status(403).json({ message: "Unauthorized: You do not own this course." });
    }

    await course.deleteOne();
    res.status(200).json({ message: "Course deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Delete failed." });
  }
};


