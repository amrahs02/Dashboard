import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Profile = () => {
  const token = useSelector((state) => state.auth.token);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [token]);

  if (!profile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 rounded-3xl bg-gray-100 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className=" p-4 rounded-3xl bg-gray-100">
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

