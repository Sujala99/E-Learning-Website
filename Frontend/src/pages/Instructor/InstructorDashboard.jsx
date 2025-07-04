import React, { useState } from 'react';
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import GetMyCourses from "./get_all courses";
import AddCourse from "./AddCourses";

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState("courses");

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar with tab controls */}
        <div className="w-64 bg-white shadow-md">
          <Sidebar setActiveTab={setActiveTab} />
        </div>

        {/* Dynamic main content */}
        <div className="flex-1 p-6">
          {activeTab === "courses" && <GetMyCourses />}
          {activeTab === "add-course" && <AddCourse />}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
