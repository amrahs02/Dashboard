import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, saveOnboarding } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.auth);
    
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        industry: ""
    });

    // ✅ Fetch user profile on page load
    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    // ✅ Pre-fill form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                role: user.role || "",
                industry: user.industry || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(saveOnboarding(formData));
        if (result.payload?.success) {
            navigate("/dashboard"); // ✅ Redirect to Dashboard
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-3xl">
                <h2 className="text-2xl font-bold text-center">Complete Your Profile</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="mt-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 mb-3 border rounded"
                        required
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full p-2 mb-3 border rounded"
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                    <input
                        type="text"
                        name="industry"
                        placeholder="Industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full p-2 mb-3 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white rounded"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Complete Onboarding"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Onboarding;
