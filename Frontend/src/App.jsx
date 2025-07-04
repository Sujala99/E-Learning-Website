import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';



import Home from './pages/Home';
import Register from './pages/register';


import InstructorDashboard from './pages/Instructor/InstructorDashboard';
import AddCourse from './pages/Instructor/AddCourses';
import { UserProvider } from './context/UserContext';
import GetMyCourses from './pages/Instructor/get_all courses';
import MyCourses from './pages/Students/MyCourses';
import Login from './pages/Login';
import SinglePage from './pages/Students/SinglePage';
import CartPage from './pages/Students/Cart';
import CheckoutPage from './pages/Students/Checkout';
import MyLearningPage from './pages/Students/LearningPage';
import Video from './pages/Students/Video';
import CourseDetailPage from './pages/Students/CoursePageDetail';
import CertificatePage from './pages/Students/Certificate';
import ProfilePage from './pages/Profile';
import ProfileEdit from './pages/Students/EditProfile';
import Logout from './pages/Logout';
import Review from './components/Review/Comment';
import Comment from './components/Review/Comment';
import EditCourse from './pages/Instructor/EditCourse';
import AboutUs from './pages/AboutUs';
import AllCertificate from './pages/Students/AllCertificate';
import CertificateViewPage from './pages/Students/CertificateViewPage'; // ✅ CORRECT


function App() {

  return (
    <UserProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/courses/addcourse" element={<AddCourse />} />
        <Route path="/instructor/courses/mycourses" element={< GetMyCourses/>} />
        <Route path="/instructor/courses/edit-course/:courseId" element={< EditCourse/>} />




        <Route path="/courses/getallcourses" element={< MyCourses/>} />
        <Route path="/courses/getallcourses/:id" element={< SinglePage/>} />
        <Route path="/cart/:studentId" element={< CartPage/>} />
        <Route path="/checkout" element={< CheckoutPage/>} />
        <Route path="/mylearning" element={< MyLearningPage/>} />
        <Route path="/video" element={< Video/>} />
        <Route path="/course/:courseId" element={< CourseDetailPage/>} />
        <Route path="/certificate/:courseId" element={<CertificatePage />} />


        <Route path="/comment" element={<Comment />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<ProfileEdit />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/all-certificate" element={<AllCertificate />} />
        <Route path="/all-certificate/view/:certificateId" element={<CertificateViewPage />} />

        {/* <Route path="*" element={<div>404 - Page Not Found</div>} /> */}
        <Route path="/logout" element={<Logout />} />
        {/* <Route path="/logout" element={<Logout />} /> */}

      </Routes>
    </Router>



    </UserProvider>
    
  );
}

export default App;
