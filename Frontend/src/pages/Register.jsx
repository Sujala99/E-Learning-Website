import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import loginImage from "../assets/images/login.png";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(username !== "" && email !== "" && password !== "");
  }, [username, email, password]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const registerUser = async (e) => {
    e.preventDefault();

    const userData = { username, email, password };

    try {
      const response = await fetch("http://localhost:4000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Registration failed.");

      setUser({ id: data.userId, isAdmin: false });

      Swal.fire({
        title: "Registration Successful",
        icon: "success",
        text: "Thank you for registering!",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        title: "Registration Failed",
        icon: "error",
        text: error.message || "Something went wrong.",
      });
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:4000/users/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      Swal.fire({
        title: "Login Successful",
        text: "Welcome back!",
        icon: "success",
      });

      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "instructor") {
        navigate("/instructor/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      Swal.fire({ title: "Google Login Error", text: error.message, icon: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-[#DADDE7] font-sans">
      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-80px)] px-4 md:px-16 py-8 gap-8">
        <div className="order-1 flex items-center justify-center bg-[#e4eaf7] p-6 rounded">
          <div className="text-center max-w-md">
            <img src={loginImage} alt="Login Visual" className="mx-auto max-h-[300px] mb-6" />
            <p className="text-md text-gray-700 font-medium">Join us and explore new opportunities!</p>
          </div>
        </div>

        <div className="order-2 flex items-center justify-center bg-white p-6 rounded shadow">
          <form onSubmit={registerUser} className="w-full max-w-sm space-y-4" autoComplete="off">
            <h2 className="text-3xl font-semibold text-gray-800">Register</h2>
            <p className="text-sm text-gray-500">Enter your details below</p>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <div className="text-sm text-right text-blue-600 cursor-pointer" onClick={togglePasswordVisibility}>
              {showPassword ? "Hide Password" : "Show Password"}
            </div>

            <button
              type="submit"
              disabled={!isActive}
              className={`w-full py-2 rounded transition duration-200 ${
                isActive
                  ? "bg-blue-800 text-white hover:bg-blue-900"
                  : "bg-gray-400 text-gray-100 cursor-not-allowed"
              }`}
            >
              Register
            </button>

            <div className="flex items-center justify-center my-4">
              <hr className="w-1/3 border-gray-300" />
              <span className="mx-2 text-gray-500 text-sm">or</span>
              <hr className="w-1/3 border-gray-300" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => Swal.fire({ title: "Google Login Failed", icon: "error" })}
              />
            </div>

            <div className="mt-6 text-sm text-gray-700 text-center">
              Already have an account?{" "}
              <span
                className="text-blue-800 font-semibold hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
