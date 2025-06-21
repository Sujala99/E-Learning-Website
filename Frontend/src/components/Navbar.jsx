import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import logo from "../assets/images/logo.png";
import { useUserContext } from "../context/UserContext";

const Navbar = () => {
  const { user } = useUserContext();

  return (
    <nav className="bg-blue-100 p-4 bg-white shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" className="h-20" />
        </Link>

        {/* Search Bar in the center */}
        <div className="flex-1 mx-6">
          <div className="flex items-center max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search Courses..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full"
            />
            <button className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full">
              Search
            </button>
          </div>
        </div>

        {/* Navigation Links and Profile/Login */}
        <div className="flex items-center space-x-4 text-blue-500 font-medium">
          <Link to="/courses/getallcourses" className="hover:text-blue-700">
            Courses
          </Link>

          {user ? (
            <>
              {/* Conditional for logged in */}
              <Link to="/mylearning" className="hover:text-blue-700">
                My Learning
              </Link>
              <Link to="/certificate" className="hover:text-blue-700">
                Certificate
              </Link>
              <Link to="/about" className="hover:text-blue-700">
                About Us
              </Link>
              <Link to="/cart/:studentId" className="text-xl hover:text-blue-700">
                <FaShoppingCart />
              </Link>
              

              {/* Profile Image or Icon */}
              <Link to="/profile" className="ml-2">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="User"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-3xl text-blue-600" />
                )}
              </Link>
            </>
          ) : (
            <>
              {/* Conditional for guest user */}
              <Link to="/about" className="hover:text-blue-700">
                About Us
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
              >
                Join Us Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
