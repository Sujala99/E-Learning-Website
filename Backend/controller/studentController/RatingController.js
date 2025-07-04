const Rating = require("../../models/RatingModels");
const Course = require("../../models/coursesModels");
const mongoose = require("mongoose");


exports.addOrUpdateRating = async (req, res) => {
  try {
    const { courseId, rating } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }

    const updatedRating = await Rating.findOneAndUpdate(
      { user: userId, course: courseId },
      { rating },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "Rating submitted", data: updatedRating });
  } catch (err) {
    console.error("Rating error:", err);
    res.status(500).json({ message: "Failed to submit rating" });
  }
};

exports.getCourseRatingStats = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }

    const stats = await Rating.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: "$course",
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const result = stats[0] || { avgRating: 0, totalRatings: 0 };
    res.status(200).json(result);
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Failed to fetch rating stats" });
  }
};


exports.getMyRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const existingRating = await Rating.findOne({ courseId, userId });

    if (!existingRating) {
      return res.status(404).json({ message: "No rating found for this course." });
    }

    res.json({ rating: existingRating.rating });
  } catch (err) {
    console.error("Error getting user rating:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};
