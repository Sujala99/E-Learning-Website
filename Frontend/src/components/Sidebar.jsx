import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const linkClass =
    'block w-full py-2 px-4 rounded transition-colors duration-200';
  const activeClass = 'bg-blue-100 text-blue-700 font-semibold';
  const inactiveClass = 'text-blue-500 hover:bg-gray-100 hover:text-blue-700';

  return (
    <aside className="w-64 h-full bg-white shadow-md p-4">
      <div className="text-center mb-6">
      </div>

      <nav>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/instructor/dashboard"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              My Courses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/instructor/courses/addcourse"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              Add Course
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/instructor/performance"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              Performance
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/instructor/notifications"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              Notifications
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              Log Out
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
