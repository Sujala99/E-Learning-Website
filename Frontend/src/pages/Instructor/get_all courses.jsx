import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GetMyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/instructor/course/mycourse", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCourses(response.data.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <div className="p-6">Loading courses...</div>;

  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.length === 0 ? (
          <p className="text-gray-600">No courses found.</p>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-md p-4">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <p className="text-gray-600">
                {course.students?.length || 0} Students | ⭐ {course.rating || 4.5}
              </p>
              <div className="flex justify-between mt-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Edit
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GetMyCourses;
