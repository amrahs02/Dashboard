import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

// Dynamic API Base URL
const API_BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://dashboardapi-1xma.onrender.com";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser(formData));
        if (result.payload?.token) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-3xl">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
                
                {/* Error Message */}
                {error && <p className="text-red-500 text-center bg-red-100 p-2 mt-2 rounded">{error}</p>}

                <form onSubmit={handleSubmit} className="mt-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 mb-3 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-300"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 mb-3 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-300"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition duration-200"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* ✅ New User Section */}
                <div className="mt-4 flex justify-center items-center">
                    <p className="text-gray-600 ">New User?</p>
                    <button
                        onClick={() => navigate("/signup")}
                        className="mx-2 text-green-500 hover:underline"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
