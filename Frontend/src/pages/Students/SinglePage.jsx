import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useUserContext } from "../../context/UserContext";

const SinglePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const { user } = useUserContext(); // ✅ pull user from context

  // Log only once when user or course is loaded
  useEffect(() => {
    if (user) console.log("✅ User loaded:", user);
  }, [user]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/instructor/course/get/details/${id}`);
      setCourse(res.data.data);
          // console.log("📘 Course Details:", res.data.data); // 👈 this logs everything

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

  const payload = { studentId, courseId };
  // console.log("📦 Sending payload to backend:", payload);

  try {
    setAddingToCart(true);
    const response = await axios.post("http://localhost:4000/cart/add", payload);
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
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8 bg-white rounded shadow mt-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <h2 className="text-md text-gray-600 mb-2">Instructor: {course.instructor || "N/A"}</h2>
          <p className="text-gray-700 mb-4">{course.description || "No description available."}</p>

          <div className="flex gap-4 mb-4">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !user || !course}
              className={`${
                addingToCart ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-2 px-4 rounded`}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
              Buy Now
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Course Content</h2>
            <ul className="bg-blue-100 p-4 rounded-lg">
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

        <div className="md:col-span-1">
          <img src={course.image} alt={course.title} className="w-full h-64 object-cover rounded-lg mb-4" />
          <div className="flex items-center mb-2">
            <span className="text-yellow-500 text-lg mr-2">⭐⭐⭐⭐⭐</span>
            <span className="text-gray-500">1000+ Reviews</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 line-through">Rs. 12000</span>
            <span className="text-blue-600 font-bold">Rs. {course.pricing}</span>
            <span className="text-green-600 font-semibold">50% Off</span>
          </div>

          <h2 className="text-md font-semibold mt-6 mb-2">This Course Includes</h2>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Money Back Guarantee</li>
            <li>Access on all devices</li>
            <li>Certification of completion</li>
            <li>{course.curriculum.length} Lectures</li>
          </ul>

          <h2 className="text-md font-semibold mt-6 mb-2">Share this course</h2>
          <div className="flex space-x-4">
            <a href="#"><img src="/facebook-icon.png" alt="Facebook" className="h-6" /></a>
            <a href="#"><img src="/twitter-icon.png" alt="Twitter" className="h-6" /></a>
            <a href="#"><img src="/instagram-icon.png" alt="Instagram" className="h-6" /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
