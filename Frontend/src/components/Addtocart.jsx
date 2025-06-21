// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Navbar from "../../components/Navbar";
// import { useUserContext } from "../../context/UserContext";

// const setAddingToCart = () => {
//   const { id } = useParams();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [addingToCart, setAddingToCart] = useState(false);

//   const { user } = useUserContext(); // ✅ pull user from context

//   // Log only once when user or course is loaded
//   useEffect(() => {
//     if (user) console.log("User loaded:", user);
//   }, [user]);



//   const handleAddToCart = async () => {
//   const studentId = user?._id || user?.id;
//   const courseId = course?._id;

//   if (!studentId || !courseId) {
//     alert("Missing user or course ID");
//     return;
//   }

//   const payload = { studentId, courseId };
// //   console.log(, payload);

//   try {
//     setAddingToCart(true);
//     const response = await axios.post("http://localhost:4000/cart/add", payload);
//     alert(response.data.message || "Added to cart successfully");
//   } catch (err) {
//     console.error("Add to cart failed:", err);
//     alert(err.response?.data?.message || "Failed to add to cart");
//   } finally {
//     setAddingToCart(false);
//   }
// };


//   if (loading) return <div className="text-center mt-10">Loading...</div>;
//   if (!course) return <div className="text-center mt-10 text-red-600">Course not found.</div>;