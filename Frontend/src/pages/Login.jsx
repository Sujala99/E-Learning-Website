import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import loginImage from "../assets/images/login.png";
import logo from "../assets/images/logo.png";
import { useUserContext } from "../context/UserContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usernameOrEmail || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const isEmail = usernameOrEmail.includes("@");
      const loginPayload = {
        password,
        ...(isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail }),
      };

      const res = await fetch("http://localhost:4000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Invalid login credentials.");
        }
        throw new Error("Server error. Please try again later.");
      }

      const data = await res.json();

      if (data.token) {
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
      } else {
        throw new Error("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message);
      Swal.fire({ title: "Error", text: err.message, icon: "error" });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Academix Logo" className="h-20" />
        </Link>
        <div className="flex gap-6 text-gray-700 font-medium">
          <Link to="/">Explore</Link>
          <a href="#Footer">Contact</a>
          <Link to="/about">About</Link>
        </div>
        <button
          onClick={() => navigate("/register")}
          className="bg-blue-800 text-white px-4 py-2 rounded-full"
        >
          Sign Up
        </button>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-80px)] px-4 md:px-16 py-8 gap-8">
        <div className="order-1 md:order-2 flex items-center justify-center bg-[#e4eaf7] p-6 rounded">
          <div className="text-center max-w-md">
            <img src={loginImage} alt="Login Visual" className="mx-auto max-h-[300px] mb-6" />
            <p className="text-md text-gray-700 font-medium">
              Log in using your email or username.
            </p>
          </div>
        </div>

        <div className="order-2 md:order-1 flex items-center justify-center bg-white p-6 rounded shadow">
          <form onSubmit={handleLogin} className="w-full max-w-sm">
            <h2 className="text-3xl font-semibold mb-2 text-gray-800">Log in</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your credentials below</p>

            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="Username or Email"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-2.5 cursor-pointer text-sm text-blue-600"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900 transition duration-200"
            >
              Log In
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

            <div className="mt-3 text-sm text-red-500 hover:underline cursor-pointer">
              Forgot Password?
            </div>

            <div className="mt-8 text-sm text-gray-700 text-center">
              Create new account?{" "}
              <span
                className="text-blue-800 font-semibold hover:underline cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
