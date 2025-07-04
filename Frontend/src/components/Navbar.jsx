import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/images/logo.png";
import { useUserContext } from "../context/UserContext";

const Navbar = () => {
  const { user } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
  }, [user]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Show only logo and profile if user is either admin OR instructor
  const isAdminOrInstructor =
    user?.role === "admin" || user?.role === "instructor";

  const renderProfileImage = () => {
    if (user?.profileImage) {
      return (
        <img
          src={user.profileImage}
          alt="User Profile"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-profile.png"; // make sure this image exists in public folder
          }}
          className="h-10 w-10 rounded-full object-cover"
        />
      );
    } else {
      return <FaUserCircle className="text-3xl text-blue-600" />;
    }
  };

  return (
    <nav className="bg-blue-100 p-4 bg-white shadow-md">
      <div className="flex items-center justify-between">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-20" />
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-blue-500 text-2xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Search bar (only if not admin or instructor) */}
        {!isAdminOrInstructor && (
          <div className="hidden md:flex-1 md:mx-6">
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
        )}

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4 text-blue-500 font-medium">
          {!isAdminOrInstructor && (
            <Link to="/courses/getallcourses" className="hover:text-blue-700">
              Courses
            </Link>
          )}

          {user ? (
            <>
              {!isAdminOrInstructor && (
                <>
                  <Link to="/mylearning" className="hover:text-blue-700">
                    My Learning
                  </Link>
                  <Link to="/all-certificate" className="hover:text-blue-700">
                    Certificate
                  </Link>
                  <Link to="/aboutus" className="hover:text-blue-700">
                    About Us
                  </Link>
                  <Link
                    to={`/cart/${user.id}`}
                    className="text-xl hover:text-blue-700"
                  >
                    <FaShoppingCart />
                  </Link>
                </>
              )}
              <Link to="/profile" className="ml-2">{renderProfileImage()}</Link>
            </>
          ) : (
            <>
              <Link to="/aboutus" className="hover:text-blue-700">
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

      {/* Mobile Menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden absolute bg-white w-full shadow-lg p-4`}
      >
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10" />
          </Link>
          <button onClick={toggleMenu} className="text-blue-500 text-2xl">
            <FaTimes />
          </button>
        </div>

        <div className="flex flex-col space-y-4 text-blue-500 font-medium">
          {!isAdminOrInstructor && (
            <Link
              to="/courses/getallcourses"
              className="hover:text-blue-700"
              onClick={toggleMenu}
            >
              Courses
            </Link>
          )}

          {user ? (
            <>
              {!isAdminOrInstructor && (
                <>
                  <Link
                    to="/mylearning"
                    className="hover:text-blue-700"
                    onClick={toggleMenu}
                  >
                    My Learning
                  </Link>
                  <Link
                    to="/all-certificate"
                    className="hover:text-blue-700"
                    onClick={toggleMenu}
                  >
                    Certificate
                  </Link>
                  <Link
                    to="/aboutus"
                    className="hover:text-blue-700"
                    onClick={toggleMenu}
                  >
                    About Us
                  </Link>
                  <Link
                    to={`/cart/${user.id}`}
                    className="text-xl hover:text-blue-700"
                    onClick={toggleMenu}
                  >
                    <FaShoppingCart />
                  </Link>
                </>
              )}
              <Link to="/profile" className="ml-2" onClick={toggleMenu}>
                {renderProfileImage()}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/aboutus"
                className="hover:text-blue-700"
                onClick={toggleMenu}
              >
                About Us
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
                onClick={toggleMenu}
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
