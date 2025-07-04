import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import CourseRatingDisplay from "../../components/CourseRatingDisplay";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import Footer from "../../components/Footer";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [sortBy, setSortBy] = useState("price-lowtohigh");
  const { user } = useUserContext();
  const navigate = useNavigate();

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

  const handleAddToCart = async (courseId) => {
    const studentId = user?._id || user?.id;

    if (!studentId) {
      alert("User ID is missing. Please log in again.");
      console.warn("Missing studentId. User object:", user);
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/cart/add", {
        studentId,
        courseId,
      });

      if (response.data.message) {
        alert(response.data.message);
      } else {
        alert("Course added to cart successfully!");
      }
    } catch (error) {
      console.error("Failed to add course to cart:", error);
      alert("Something went wrong while adding the course to your cart.");
    }
  };

  const handleBuyNow = (course) => {
    localStorage.setItem("cart", JSON.stringify([course]));
    navigate("/checkout");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Navbar />
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
          <div
            key={course._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition duration-200 p-4 flex flex-col items-center"
          >
            <Link to={`/courses/getallcourses/${course._id}`} className="block">
              <img
                src={
                  course.image && course.image !== ""
                    ? course.image
                    : "/default-placeholder.jpg"
                }
                alt={course.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <div className="flex items-center justify-between mb-2">
                <CourseRatingDisplay courseId={course._id} />
                <span className="text-gray-500 text-sm">
                  {course.curriculum?.length || 0} Lessons
                </span>
              </div>
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-600 text-sm mb-2">{course.instructorName || "Instructor"}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="line-through text-gray-500">
                  ₹{course.discountPrice || 0}
                </span>
                <span className="text-blue-600 font-bold">
                  ₹{course.pricing || "free"}
                </span>
              </div>
            </Link>
            <div className="flex items-center justify-between w-full">
  <button
  className="text-white font-bold py-1 px-3 rounded transition-colors"
  style={{ backgroundColor: "#0074B7" }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#005a91")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0074B7")}
  onClick={() => handleAddToCart(course._id)}
>
  Add To Cart
</button>

<button
  className="text-white font-bold py-1 px-3 rounded transition-colors"
  style={{ backgroundColor: "#FF0000" }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#cc0000")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#FF0000")}
  onClick={() => handleBuyNow(course)}
>
  Buy Now
</button>

</div>

          </div>
        ))}
      </div>
      <Footer/>
    </div>
  );
};

export default MyCourses;