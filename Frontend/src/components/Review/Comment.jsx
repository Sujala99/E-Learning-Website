import React, { useState } from "react";
import axios from "axios";

const Comment = ({ comment, currentUserId, onEdit, onDelete, level = 0, refresh }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
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
      refresh(); // Refresh comments
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  return (
    <div className={`ml-${level * 5} py-3 border-b`}>
      <div className="flex justify-between items-start">
        <div className="w-full">
          <p className="font-semibold text-gray-800">{comment.user?.name || comment.user?.username}</p>
          
          {/* If it's a reply, show replied-to user */}
          {comment.replyOnUser && (
            <p className="text-sm text-blue-600 font-medium mb-1">
              Replying to @{comment.replyOnUser?.name || comment.replyOnUser?.username}
            </p>
          )}
          
          <p className="text-gray-700">{comment.desc}</p>
        </div>

        {canModify && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)}>⋯</button>
            {showMenu && (
              <div className="absolute right-0 bg-white shadow rounded border p-2 z-10">
                <button
                  className="block w-full text-left text-sm text-blue-500"
                  onClick={() => onEdit(comment)}
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left text-sm text-red-500"
                  onClick={() => onDelete(comment._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => setIsReplying(!isReplying)}
        className="text-sm text-blue-500 mt-1"
      >
        Reply
      </button>

      {isReplying && (
        <div className="mt-2">
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder={`Reply to ${comment.user?.name || comment.user?.username}`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            onClick={handleReplySubmit}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-1"
          >
            Post Reply
          </button>
        </div>
      )}

      {/* Recursive replies */}
      {comment.replies?.length > 0 &&
        comment.replies.map((reply) => (
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
  );
};

export default Comment;
