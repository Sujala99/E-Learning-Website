import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Comment from './Comment';

const Review = ({ courseId }) => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [user, setUser] = useState(null);

  const token = localStorage.getItem('token'); // Store your JWT here

  useEffect(() => {
    // Load user from token (optional, adjust depending on your setup)
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUser(decoded); // Assuming payload has { id, role, ... }
    }
  }, [token]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get('/comment/getallcomment', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            courseSlug: courseId,
          },
        });

        // Ensure the data is always an array
        const data = Array.isArray(res.data) ? res.data : [];
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setComments([]); // fallback to empty array
      }
    };

    fetchComments();
  }, [courseId, token]);

  const handleNewCommentSubmit = async () => {
    if (!user) {
      alert('Please log in to comment.');
      return;
    }

    if (newCommentText.trim()) {
      try {
        const res = await axios.post(
          'http://localhost:4000/comment/addcomment',
          {
            desc: newCommentText,
            slug: courseId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComments([res.data, ...comments]);
        setNewCommentText('');
      } catch (err) {
        console.log("Sending comment with data:", {
  courseId,
  commentText,
  userId
});

        console.error('Failed to post comment:', err.response ? err.response.data : err.message);
        alert('Failed to post comment. Please try again.');
      }
    }
  };

  const handleReply = (updatedComment) => {
    setComments((prev) =>
      prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
    );
  };

  return (
    <div>
      <div className="mb-4">
        {user ? (
          <>
            <input
              type="text"
              placeholder="Write a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleNewCommentSubmit}
              className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
            >
              Post
            </button>
          </>
        ) : (
          <p className="text-gray-600">Please log in to comment.</p>
        )}
      </div>

      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} onReply={handleReply} />
      ))}
    </div>
  );
};

export default Review;