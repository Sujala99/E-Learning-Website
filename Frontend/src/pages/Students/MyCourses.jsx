import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [sortBy, setSortBy] = useState("price-lowtohigh");

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/student/course/getCourses",
        {
          params: { sortBy },
        }
      );
      setCourses(response.data.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [sortBy]);

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">All Available Courses</h1>

        <div className="flex justify-end mb-6">
          <select
            className="border border-gray-300 rounded p-2 shadow-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="price-lowtohigh">Price: Low to High</option>
            <option value="price-hightolow">Price: High to Low</option>
            <option value="title-atoz">Title: A to Z</option>
            <option value="title-ztoa">Title: Z to A</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course._id}
              to={`/courses/getallcourses/${course._id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition duration-200 p-4"
            >
              <img
                src={
                  course.image && course.image !== ""
                    ? course.image
                    : "/default-placeholder.jpg"
                }
                alt={course.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-600 text-sm mb-2">{course.instructor || "Instructor"}</p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-500 mr-2">
                  ⭐ {course.rating || "4.5"}
                </span>
                <span className="text-gray-500 text-sm">
                  {course.lessons || 0} Lessons
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="line-through text-gray-500">
                  ₹{course.discountPrice || 2000}
                </span>
                <span className="text-blue-600 font-bold">
                  ₹{course.pricing || 999}
                </span>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                onClick={(e) => {
                  e.preventDefault(); // prevents link navigation
                  alert("Added to cart (not implemented)");
                }}
              >
                Add To Cart
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
