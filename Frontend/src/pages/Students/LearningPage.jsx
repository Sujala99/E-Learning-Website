import React, { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function LearningPage() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    async function fetchCourses() {
      try {
        const res = await fetch(`http://localhost:4000/studentCourses/get/${user.id}`);
        const data = await res.json();
        if (data.success) {
          setCourses(data.data);
        } else {
          setError("No courses found.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching courses.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [user, navigate]);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (courses.length === 0) return <p>No purchased courses found.</p>;

  return (
    <div>
      <Navbar/>
      <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Learning</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div key={course._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src={course.courseImage }
              alt={course.courseImage}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <div className="relative pt-1 mb-3">
                <div className="overflow-hidden h-2 text-xs bg-gray-200 rounded">
                  <span
                    className="block h-2 bg-blue-500"
                    style={{ width: `${course.progress || 0}%` }}
                  />
                </div>
                <small>{course.progress || 0}% completed</small>
              </div>
              <Link
                to={`/course/${course.courseId}`}
                className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded"
              >
                Continue Course →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer/>

    </div>
      );
}

export default LearningPage;
