import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-pink-600">WaxingTime</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-pink-600 text-white hover:bg-pink-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* Client Links */}
                {user.role === 'client' && (
                  <Link
                    to="/client"
                    className="text-gray-600 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    My Profile
                  </Link>
                )}

                {/* Employee Links */}
                {user.role === 'staff' && (
                  <Link
                    to="/employee"
                    className="text-gray-600 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Staff Dashboard
                  </Link>
                )}

                {/* Admin Links */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* User Menu */}
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-4">{user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;