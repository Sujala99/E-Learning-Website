const User = require("../models/userModels");
const Course = require("../models/coursesModels");

// GET /api/home/data
exports.getHomeData = async (req, res, next) => {
  try {
    const instructors = await User.aggregate([
      { $match: { role: "instructor" } },
      { $sample: { size: 6 } }
    ]);

    const courses = await Course.aggregate([
      { $match: {} },
      { $sample: { size: 9 } }
    ]);

    res.json({ success: true, instructors, courses });
  } catch (err) {
    next(err);
  }
};
