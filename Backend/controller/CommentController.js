const Comment = require("../models/CommentModels");
const Course = require("../models/coursesModels");

exports.createComment = async (req, res, next) => {
  try {
    const { desc, courseId, parent, replyOnUser } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const newComment = new Comment({
      user: req.user.id,
      desc,
      course: course._id,
      parent: parent || null,
      replyOnUser: replyOnUser || null,
    });

    const savedComment = await newComment.save();
    return res.status(201).json(savedComment);
  } catch (error) {
    next(error);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const { desc } = req.body;
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // 🔐 Check if current user is the author
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to edit this comment" });
    }

    comment.desc = desc ?? comment.desc;
    const updatedComment = await comment.save();
    return res.json(updatedComment);
  } catch (error) {
    next(error);
  }
};


exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // 🔐 Check if current user is the author
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    await comment.deleteOne(); // deletes current comment
    await Comment.deleteMany({ parent: comment._id }); // delete its replies too

    return res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};


exports.getAllComments = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    const courseId = req.query.courseId;

    const where = {};
    if (filter) {
      where.desc = { $regex: filter, $options: "i" };
    }
    if (courseId) {
      where.course = courseId;
    }

    let query = Comment.find(where);

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await Comment.countDocuments(where);
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": filter || "",
      "x-totalcount": total,
      "x-currentpage": page,
      "x-pagesize": pageSize,
      "x-totalpagecount": pages,
    });

    if (page > pages) {
      return res.json([]);
    }

    const result = await query
      .skip(skip)
      .limit(pageSize)
      .populate([
        {
          path: "user",
         select: ["username", "avatar"]
        },
        {
          path: "parent",
          populate: {
            path: "user",
            select: ["avatar", "name"],
          },
        },
        {
          path: "replyOnUser",
          select: ["avatar", "name"],
        },
        {
          path: "course",
          select: ["_id", "title"],
        },
      ])
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};



exports.getCommentsByCourseId = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const comments = await Comment.find({ course: courseId, parent: null }) // Top-level comments only
      .populate([
  {
    path: "user",
    select: ["username", "avatar"],  
  },
  {
    path: "replies",
    populate: [
      {
        path: "user",
        select: ["username", "avatar"], 
      },
      {
        path: "replyOnUser",
        select: ["username", "avatar"],  
      },
    ],
  },
])

      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
