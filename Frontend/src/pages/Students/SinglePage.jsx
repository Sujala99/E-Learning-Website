import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Rating from "../../components/Rating";
import CourseRatingDisplay from "../../components/CourseRatingDisplay";
import { useUserContext } from "../../context/UserContext";
import Footer from "../../components/Footer";

const SinglePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const { user } = useUserContext();

  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/instructor/course/get/details/${id}`
      );
      setCourse(res.data.data);
    } catch (err) {
      console.error("Error fetching course:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleAddToCart = async () => {
    const studentId = user?._id || user?.id;
    const courseId = course?._id;

    if (!studentId || !courseId) {
      alert("Missing user or course ID");
      return;
    }

    try {
      setAddingToCart(true);
      const response = await axios.post("http://localhost:4000/cart/add", {
        studentId,
        courseId,
      });
      alert(response.data.message || "Added to cart successfully");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!course) return <div className="text-center mt-10 text-red-600">Course not found.</div>;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Section (for small screen shown later) */}
        <div className="order-1 md:order-2">
          <img
            src={course.image || "/default-placeholder.jpg"}
            alt={course.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <CourseRatingDisplay courseId={course._id} />

          <div className="flex items-center justify-between my-3">
            <span className="text-[#0074B7] font-bold text-xl">Rs. {course.pricing}</span>
          </div>

          <h2 className="text-md font-semibold mt-6 mb-2">This Course Includes</h2>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {course.skills && course.skills.length > 0 ? (
              course.skills.map((skill, idx) => <li key={idx}>{skill}</li>)
            ) : (
              <li>No skills listed.</li>
            )}
          </ul>

          <h2 className="text-md font-semibold mt-6 mb-2">Share this course</h2>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
              <img src="/facebook-icon.svg" alt="Facebook" className="h-6" />
            </a>
            <a href="https://www.twitter.com/" target="_blank" rel="noreferrer">
              <img src="/twitter-icon.svg" alt="Twitter" className="h-6" />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
              <img src="/instagram-icon.svg" alt="Instagram" className="h-6" />
            </a>
          </div>
        </div>

        {/* Right Section (course details) */}
        <div className="order-2 md:order-1">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <h2 className="text-md text-gray-600 mb-4">
            Instructor: {course.instructorName || "N/A"}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !user || !course}
              className={`${
                addingToCart
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0074B7] hover:bg-[#005f93]"
              } text-white py-2 px-4 rounded transition-colors duration-200`}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button
              className="bg-[#FF4C4C] hover:bg-[#cc0000] text-white py-2 px-4 rounded transition-colors duration-200"
            >
              Buy Now
            </button>
          </div>

          <p className="text-gray-700 mb-6">
            {course.description || "No description available."}
          </p>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Course Content</h2>
            <ul className="bg-gray-100 p-4 rounded-lg">
              {course.curriculum.map((lec, index) => (
                <li
                  key={lec._id || index}
                  className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm mb-2"
                >
                  <span>{lec.title}</span>
                  <span className="text-gray-500 text-sm">Video</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Reviews</h2>
            <p className="text-gray-600">No reviews yet.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SinglePage;
