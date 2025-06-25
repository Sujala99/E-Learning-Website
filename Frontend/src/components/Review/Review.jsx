import React, { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment";
import { useUserContext } from "../../context/UserContext";

const Review = ({ courseId }) => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const { user } = useUserContext();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get("http://localhost:4000/comment/getallcomment", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            courseId: courseId,
          },
        });

        const data = Array.isArray(res.data) ? res.data : [];
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setComments([]);
      }
    };

    fetchComments();
  }, [courseId, token]);

  const handleNewCommentSubmit = async () => {
    if (!user) {
      alert("Please log in to comment.");
      return;
    }

    if (newCommentText.trim()) {
      try {
        const res = await axios.post(
          "http://localhost:4000/comment/addcomment",
          {
            desc: newCommentText,
            courseId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComments([res.data, ...comments]);
        setNewCommentText("");
      } catch (err) {
        console.error("Failed to post comment:", err);
        alert("Failed to post comment.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Write a comment..."
        />
        <button
          onClick={handleNewCommentSubmit}
          className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
        >
          Post
        </button>
      </div>

      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} onReply={() => {}} />
      ))}
    </div>
  );
};

export default Review;
