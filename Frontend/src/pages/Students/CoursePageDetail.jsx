import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";

function CourseDetailPage() {
  const { user } = useUserContext();
  const { courseId } = useParams();

  const [courseDetails, setCourseDetails] = useState(null);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const [progress, setProgress] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);

  const fetchCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/course/progress/get/${user.id}/${courseId}`
      );
      const data = await response.json();
      console.log("🎯 Fetched course data:", data);

      if (data.success) {
        setCourseDetails(data.data.courseDetails);
        setProgress(data.data.progress || []);
        setCompleted(data.data.completed || false);
        setIsPurchased(data.data.isPurchased);
      }
    } catch (err) {
      console.error("❌ Failed to fetch course:", err);
    } finally {
      setLoading(false);
    }
  };

  const markLectureAsViewed = async (lectureId) => {
    try {
      await fetch("http://localhost:4000/course/progress/mark-lecture-viewed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, courseId, lectureId }),
      });
      fetchCourse(); // Refresh progress after marking
    } catch (e) {
      console.error("Failed to mark lecture as viewed", e);
    }
  };

  useEffect(() => {
    if (!user || !user.id || !courseId) {
      console.warn("❗ Missing user or courseId", { user, courseId });
      return;
    }
    fetchCourse();
  }, [user, courseId]);

  if (loading) return <p>Loading course details...</p>;
  if (!isPurchased) return <p>Course not found or not purchased.</p>;
  if (!courseDetails) return <p>Course details not available.</p>;

  const currentLecture = courseDetails.curriculum[currentLectureIndex];
  const isViewed = progress?.some(
    (p) => p.lectureId === currentLecture._id && p.viewed
  );

  return (
    <div>
      <h1>{courseDetails.title}</h1>
      {completed && <p style={{ color: "green" }}>✅ Course Completed!</p>}

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 3 }}>
          <h2>Lecture: {currentLecture.title}</h2>
          <video
            width="100%"
            controls
            src={currentLecture.videoUrl}
            onEnded={() => {
              if (!isViewed) markLectureAsViewed(currentLecture._id);
            }}
          />
          <p>{isViewed ? "✅ Viewed" : "⏳ Not Viewed Yet"}</p>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Chapters</h3>
          <ul>
            {courseDetails.curriculum.map((lecture, index) => (
              <li key={lecture._id} style={{ cursor: "pointer" }}>
                <button onClick={() => setCurrentLectureIndex(index)}>
                  {lecture.title}{" "}
                  {progress.some(
                    (p) => p.lectureId === lecture._id && p.viewed
                  )
                    ? "✅"
                    : ""}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;
