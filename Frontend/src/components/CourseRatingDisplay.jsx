// components/CourseRatingDisplay.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const CourseRatingDisplay = ({ courseId }) => {
  const [stats, setStats] = useState({ avgRating: 0, totalRatings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/rating/stats/${courseId}`);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch rating stats:", err);
      }
    };

    if (courseId) fetchStats();
  }, [courseId]);

  return (
    <div className="flex items-center space-x-2 mt-2">
      <div className="flex text-yellow-400 text-lg">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < Math.round(stats.avgRating) ? "★" : "☆"}</span>
        ))}
      </div>
      {/* <span className="text-sm text-gray-600">
        ({stats.avgRating.toFixed(1)} / 5 from {stats.totalRatings} rating{stats.totalRatings !== 1 ? "s" : ""})
      </span> */}
    </div>
  );
};

export default CourseRatingDisplay;
