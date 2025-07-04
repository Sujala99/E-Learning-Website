import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function ProfileEdit() {
  const [profile, setProfile] = useState({
    username: '',
    fullName: '',
    password: '',
    newPassword: '',
    image: null, 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const response = await axios.get('http://localhost:4000/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setProfile({ ...profile, image: e.target.files[0] });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const formData = new FormData();
  formData.append("fullname", profile.fullName);
  if (profile.password) formData.append("password", profile.password);
  if (profile.image instanceof File) {
    formData.append("image", profile.image);
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      "http://localhost:4000/users/updateProfile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Profile updated:", response.data);
    alert("Profile updated successfully");
  } catch (err) {
    setError(err.response?.data?.message || "Failed to update profile");
  } finally {
    setLoading(false);
  }
};


  return (
  <div>
    <Navbar/>
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Profile picture */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
            Profile Picture
          </label>
          <input
            className="block w-full"
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
          />
        </div>
        {/* Username */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            name="username"
            value={profile.username}
            onChange={handleChange}
            disabled
          />
        </div>
        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            disabled
          />
        </div>
        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="fullName">
            Full Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="fullName"
            type="text"
            placeholder="Full Name"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
          />
        </div>
        {/* Add other fields similarly */}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
    <Footer/>
  </div>
  );
}

export default ProfileEdit;