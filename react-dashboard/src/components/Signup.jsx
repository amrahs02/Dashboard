import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/authSlice"; // ✅ Redux action
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://dashboardapi-1xma.onrender.com";

const Signup = () => {
    const location = useLocation(); // ✅ Get previous page data (if redirected)
    const [formData, setFormData] = useState({
        name: "",
        email: location.state?.email || "", // ✅ Auto-fill email if redirected
        password: "",
    });

    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(signupUser({ ...formData, API_BASE_URL })); // ✅ Pass API URL

        if (result.payload?.token) {
            navigate("/onboarding"); // ✅ Redirect to onboarding after signup
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-3xl">
                <h2 className="text-2xl font-bold text-center">Sign Up</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="mt-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 mb-3 border rounded-3xl"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 mb-3 border rounded-3xl"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 mb-3 border rounded-3xl"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white rounded-3xl"
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                {/* ✅ Already a User Section */}
                <div className="mt-4 flex justify-center items-center text-center">
                    <p className="text-gray-600">Already a user?</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="mx-3 text-green-500 rounded-3xl"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
