import React, { useState } from "react";

const Comment = ({ comment, level = 0, onReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      // TODO: Send reply to backend
      setReplyText("");
      setIsReplying(false);
    }
  };

  return (
    <div className={`ml-${level * 5} py-2 border-b`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">{comment.user?.name}</p>
          <p className="text-gray-600">{comment.desc}</p>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)}>⋯</button>
          {showMenu && (
            <div className="absolute right-0 bg-white shadow rounded border p-2 z-10">
              <button className="block w-full text-left text-sm text-blue-500">Edit</button>
              <button className="block w-full text-left text-sm text-red-500">Delete</button>
            </div>
          )}
        </div>
      </div>

      <button onClick={() => setIsReplying(true)} className="text-sm text-blue-500 mt-1">
        Reply
      </button>

      {isReplying && (
        <div className="mt-2">
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            onClick={handleReplySubmit}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-1"
          >
            Reply
          </button>
        </div>
      )}

      {comment.replies?.length > 0 &&
        comment.replies.map((reply) => (
          <Comment key={reply._id} comment={reply} level={level + 1} onReply={onReply} />
        ))}
    </div>
  );
};

export default Comment;
