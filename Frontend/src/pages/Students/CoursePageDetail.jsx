import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Review from '../../components/Review/Review'; // Import the Review component

function CourseDetailPage() {
  const { user } = useUserContext();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(null);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const [progress, setProgress] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [activeTab, setActiveTab] = useState("Chapter");

  const fetchCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/course/progress/get/${user.id}/${courseId}`
      );
      const data = await response.json();

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

  useEffect(() => {
    if (!user?.id || !courseId) return;
    fetchCourse();
  }, [user, courseId]);

  if (loading) return <p>Loading course details...</p>;
  if (!isPurchased) return <p>Course not found or not purchased.</p>;
  if (!courseDetails) return <p>Course details not available.</p>;

  const currentLecture = courseDetails.curriculum[currentLectureIndex];
  const isViewed = progress?.some(
    (p) => p.lectureId === currentLecture._id && p.viewed
  );

  // Check if all lectures are completed
  const allLecturesCompleted = courseDetails.curriculum.every(lecture =>
    progress.some(p => p.lectureId === lecture._id && p.viewed)
  );

  const handleGenerateCertificate = () => {
    if (!allLecturesCompleted) {
      alert("Please complete all lectures first.");
      return;
    }

    // ✅ Navigate with all required certificate data
    navigate(`/certificate/${courseId}`, {
      state: {
        userId: user.id,
        username: user.username,
        courseId,
        courseName: courseDetails.title,
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Bar - Lecture Title */}
      <div className="text-2xl font-bold border-b pb-2">
        {currentLecture.title}
      </div>

      {/* Video Player - Full Width */}
      <div>
        <video
          width="100%"
          controls
          src={currentLecture.videoUrl}
          className="rounded shadow"
        />
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 rounded-lg p-4 shadow-md">
        <div className="flex gap-4 mb-4">
          {["Chapter", "Notes", "Question", "Review"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold px-3 py-1 rounded ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "Chapter" && (
            <ul className="space-y-2">
              {courseDetails.curriculum.map((lecture, index) => {
                const viewed = progress.some(
                  (p) => p.lectureId === lecture._id && p.viewed
                );
                return (
                  <li
                    key={lecture._id}
                    className="flex justify-between items-center bg-white rounded px-3 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => setCurrentLectureIndex(index)}
                  >
                    <span>{lecture.title}</span>
                    <span
                      className={`text-xs font-bold ${
                        viewed ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {viewed ? "Completed" : "Incomplete"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {activeTab === "Notes" && (
            <div className="text-gray-600 text-sm">
              Notes for this lecture coming soon.
            </div>
          )}

          {activeTab === "Question" && (
            <div className="text-gray-600 text-sm">
              Questions and exercises will appear here.
            </div>
          )}

          {activeTab === "Review" && (
            <Review courseId={courseId} />
          )}
        </div>
      </div>

      {/* Generate Certificate Button */}
      {allLecturesCompleted && (
        <button
          onClick={handleGenerateCertificate}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Generate Certificate
        </button>
      )}
    </div>
  );
}

export default CourseDetailPage;