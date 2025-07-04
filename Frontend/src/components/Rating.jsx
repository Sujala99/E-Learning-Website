// components/Rating.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Rating = ({ courseId, user }) => {
  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchRatings = async () => {
    try {
      const statsRes = await axios.get(`http://localhost:4000/api/ratings/stats/${courseId}`);
      setAvgRating(statsRes.data.avgRating.toFixed(1));
      setTotalRatings(statsRes.data.totalRatings);
    } catch (err) {
      console.error("Failed to fetch average rating", err);
    }
  };

const fetchMyRating = async () => {
  if (!user) return;
  try {
    const myRes = await axios.get(`http://localhost:4000/api/ratings/my/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (myRes.data && myRes.data.rating) {
      setUserRating(myRes.data.rating);
    }
  } catch (err) {
    if (err.response?.status !== 404) {
      console.error("Error fetching user rating", err);
    }
    // If no rating, just leave userRating null
  }
};


  const handleRate = async (newRating) => {
    if (!user) return alert("Login to submit rating");
    try {
      await axios.post(
        `http://localhost:4000/api/ratings/rate`,
        { courseId, rating: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserRating(newRating);
      fetchRatings(); // Refresh stats
    } catch (err) {
      console.error("Rating failed", err);
      alert("Rating failed. Try again.");
    }
  };

  useEffect(() => {
    fetchRatings();
    fetchMyRating();
    setLoading(false);
  }, [courseId, user]);

  return (
    <div className="mt-4">
      <h2 className="text-md font-semibold mb-1">⭐ Course Rating</h2>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className={`text-2xl cursor-pointer transition duration-200 ${
              (hoverRating || userRating) >= star ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-gray-600 text-sm">
          ({avgRating}/5 from {totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
        </span>
      </div>
      {userRating && (
        <p className="text-sm text-green-600 mt-1">You rated this course: {userRating} star{userRating > 1 ? "s" : ""}</p>
      )}
    </div>
  );
};

export default Rating;
