import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API_BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://dashboardapi-1xma.onrender.com";

const Profile = () => {
  const token = useSelector((state) => state.auth.token);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
      }
    };

    fetchProfile();
  }, [token]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!profile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 rounded-3xl bg-gray-100 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="p-4 rounded-3xl bg-white shadow-md">
        <p><strong>Full Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role || "Not specified"}</p>
        <p><strong>Industry:</strong> {profile.industry || "Not specified"}</p>
        <p><strong>Onboarding Complete:</strong> {profile.onboardingComplete ? "Yes" : "No"}</p>
      </div>
    </div>
  );
};

export default Profile;
