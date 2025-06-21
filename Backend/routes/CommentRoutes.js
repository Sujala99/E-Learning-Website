const express = require("express");
const router = express.Router();
const commentController = require("../controller/CommentController");
const { authenticateToken } = require("../Security/Auth");

// Create comment
router.post("/addcomment", authenticateToken, commentController.createComment);

// Update comment
router.put("/:commentId", authenticateToken, commentController.updateComment);

// Delete comment
router.delete("/:commentId", authenticateToken, commentController.deleteComment);

// Get all comments (optionally filtered by courseId)
router.get("/getallcomment", commentController.getAllComments);

module.exports = router;
