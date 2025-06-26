import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from "../context/UserContext"; // Import as default export

const Logout = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user context or perform logout actions only once
    setUser(null);
    localStorage.removeItem('token'); // Clear token from storage

    // Navigate back to home or login page after logout
    navigate('/login', { replace: true });
  }, [setUser, navigate]); // Empty dependency array ensures it runs only once

  return null;
}

export default Logout;