import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/images/logo.png";
import { useUserContext } from "../context/UserContext";

const NavbarAdmin = () => {
  const { user } = useUserContext();

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" className="h-16 object-contain" />
        </Link>

        {/* Profile */}
        <div>
          <Link to="/profile">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-3xl text-blue-600" />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
