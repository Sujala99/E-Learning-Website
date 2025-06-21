import React, { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function LearningPage() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    async function fetchCourses() {
      try {
        const url = `http://localhost:4000/studentCourses/get/${user.id}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setCourses(data.data);
        } else {
          setError("Failed to fetch courses");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("An error occurred while fetching courses");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [user, navigate]);

  if (loading) return <p className="text-gray-600">Loading courses...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Learning</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={course.courseImage || "https://via.placeholder.com/150"}
              alt={course.courseImage}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <span
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    style={{ width: `${course.progress}%` }}
                  >
                    {course.progress}%
                  </span>
                </div>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                <Link
  to={`/course/${course._id}`}
  className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 text-center"
>
  Start This Lesson
</Link>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LearningPage;
