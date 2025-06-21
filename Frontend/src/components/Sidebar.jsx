import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <div className="flex items-center justify-center mb-4">
        <img
          className="h-12 w-auto"
          src="path-to-your-logo.png" // Replace with your logo path
          alt="ADACEMIX"
        />
      </div>
      <ul>
        <li className="mb-2">
          <Link to="/instructor/courses/mycourses" className="block w-full py-2 px-4 rounded hover:bg-gray-200 text-blue-500 hover:text-blue-700"> Courses</Link>
        </li>
        <li className="mb-2">
          <Link to="/instructor/courses/addcourse" className="block w-full py-2 px-4 rounded hover:bg-gray-200 text-blue-500 hover:text-blue-700">Add Courses</Link>
        </li>
        <li className="mb-2">
          <a href="#" className="block w-full py-2 px-4 rounded hover:bg-gray-200 text-blue-500 hover:text-blue-700">Performances</a>
        </li>
        <li className="mb-2">
          <a href="#" className="block w-full py-2 px-4 rounded hover:bg-gray-200 text-blue-500 hover:text-blue-700">Notification</a>
        </li>
        <li className="mb-2">
          <a href="#" className="block w-full py-2 px-4 rounded hover:bg-gray-200 text-blue-500 hover:text-blue-700">Profile</a>
        </li>
        <li className="mb-2">
          <a href="#" className="block w-full py-2 px-4 rounded hover:bg-gray-200 text-blue-500 hover:text-blue-700">Log out</a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;