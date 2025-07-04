import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, setUser } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token provided');

        const response = await axios.get('http://localhost:4000/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const isAdminOrInstructor = user?.role === 'admin' || user?.role === 'instructor';

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              user?.image && user.image !== ''
                ? `http://localhost:4000/uploads/${user.image}`
                : '/default-placeholder.jpg'
            }
            alt={user?.username}
            className="w-32 h-32 rounded-full mb-4"
          />
          <h3 className="text-xl font-semibold">{user?.username}</h3>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>

        <ul className="space-y-2">
          <li>
            <Link to="/edit-profile" className="hover:underline">
              Edit Profile
            </Link>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Settings
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Password and Security
            </a>
          </li>

          {/* Only show if NOT admin or instructor */}
          {!isAdminOrInstructor && (
            <>
              <li>
                <a href="#" className="hover:underline">
                  My Learning
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Certificate
                </a>
              </li>
            </>
          )}

          <li>
            <a href="#" className="hover:underline">
              Report and Compliance
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Help and Support
            </a>
          </li>
          <li>
            <a href="/logout" className="hover:underline">
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
