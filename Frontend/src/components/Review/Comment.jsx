import React, { useState } from "react";
import axios from "axios";

const Comment = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  level = 0,
  refresh,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const token = localStorage.getItem("token");

  const canModify = [comment.user?._id, comment.user?.id].includes(currentUserId);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    try {
      await axios.post(
        "http://localhost:4000/comment/addcomment",
        {
          desc: replyText,
          courseId: comment.course?._id || comment.course,
          parent: comment._id,
          replyOnUser: comment.user?._id || comment.user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setReplyText("");
      setIsReplying(false);
      refresh();
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  return (
    <div className="flex gap-3 py-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold uppercase">
          {comment.user?.name?.charAt(0)}
        </div>
      </div>

      {/* Comment Content */}
      <div className="flex-1">
        {/* Username and Date */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-900">
              {comment.user?.username || comment.user?.name}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Edit/Delete Controls */}
          {canModify && (
            <div className="text-sm text-gray-400 space-x-2">
              <button
                onClick={() => onEdit(comment)}
                className="hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(comment._id)}
                className="hover:text-red-500"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Comment Text */}
        <p className="text-sm mt-1 text-gray-800">{comment.desc}</p>

        {/* Reply + View Replies */}
        <div className="mt-2 flex items-center gap-4 text-sm text-blue-500">
          <button onClick={() => setIsReplying(!isReplying)}>Reply</button>
          {comment.replies?.length > 0 && (
            <button onClick={() => setShowReplies(!showReplies)}>
              {showReplies
                ? "Hide replies"
                : `View ${comment.replies.length} repl${
                    comment.replies.length === 1 ? "y" : "ies"
                  }`}
            </button>
          )}
        </div>

        {/* Reply Input */}
        {isReplying && (
          <div className="mt-2">
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded text-sm"
              placeholder={`Reply to ${comment.user?.name}`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button
              onClick={handleReplySubmit}
              className="mt-1 bg-blue-500 text-white text-sm px-3 py-1 rounded"
            >
              Post
            </button>
          </div>
        )}

        {/* Nested Replies */}
        {showReplies && comment.replies?.length > 0 && (
          <div className="mt-3 ml-6 border-l border-gray-300 pl-4">
            {comment.replies.map((reply) => (
              <Comment
                key={reply._id}
                comment={reply}
                currentUserId={currentUserId}
                onEdit={onEdit}
                onDelete={onDelete}
                level={level + 1}
                refresh={refresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
