import React, { useState } from 'react';

const Comment = ({ comment, level = 0, onReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReplyClick = () => {
    setIsReplying(true);
  };

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply({ ...comment, replies: [...(comment.replies || []), { text: replyText, user: 'User' }] });
      setReplyText('');
    }
  };

  return (
    <div className={`ml-${level * 20} ${isReplying ? 'border-t' : ''}`}>
      <div className="flex items-center mb-2">
        <span className="mr-2">{comment.user}</span>
        <span className="text-sm text-gray-500">{comment.text}</span>
      </div>
      {isReplying && (
        <div className="mt-2">
          <input
            type="text"
            placeholder="Reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button onClick={handleReplySubmit} className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">Reply</button>
        </div>
      )}
      <button onClick={handleReplyClick} className="text-blue-500 hover:underline cursor-pointer">Reply</button>
    </div>
  );
};

export default Comment;