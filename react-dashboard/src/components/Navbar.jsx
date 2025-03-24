import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // ✅ Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!token) return null; // Hide Navbar if not logged in

  return (
    <nav className="bg-gray-800 p-5 m-2 rounded-3xl text-white flex justify-between items-center">
      {/* Left Section - Logo */}
      <Link to="/dashboard" className="text-lg font-bold">
        Woloo Dashboard
      </Link>

      {/* Middle Section - Navigation */}
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:text-gray-300">
          Dashboard
        </Link>
        <Link to="/tasks" className="hover:text-gray-300">
          Tasks
        </Link>
        {/* ✅ Added Profile Button */}
        <Link to="/profile" className="hover:text-gray-300">
          Profile
        </Link>
      </div>

      {/* Right Section - Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded-3xl hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
