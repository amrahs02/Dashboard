import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState(null);
    const [summary, setSummary] = useState("");

    // Fetch Analytics Data
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/analytics", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAnalytics(response.data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            }
        };

        fetchAnalytics();
    }, [token]);

    // Fetch AI Summary
    useEffect(() => {
        if (analytics) {
            const fetchSummary = async () => {
                try {
                    const response = await axios.post(
                        "http://localhost:5000/api/summary",
                        { data: analytics },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setSummary(response.data.summary);
                } catch (error) {
                    console.error("Error generating summary:", error);
                }
            };

            fetchSummary();
        }
    }, [analytics, token]);


    return (
        <div>

            <div className="p-6 max-w-4xl rounded-3xl bg-gray-100 mx-auto">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

                {/* Analytics Section */}
                {analytics && (
                    <div className="mb-6 p-4 bg-gray-100 rounded-3xl shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Analytics Overview</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[analytics]}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="totalUsers" fill="#8884d8" name="Total Users" />
                                <Bar dataKey="activeUsers" fill="#82ca9d" name="Active Users" />
                                <Bar dataKey="sales" fill="#ffc658" name="Sales" />
                                <Bar dataKey="growth" fill="#ff8042" name="Growth %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* AI-Generated Summary */}
                {summary && (
                    <div className="mb-6 p-4 bg-blue-100 rounded-3xl shadow-md">
                        <h2 className="text-xl font-semibold">AI-Generated Summary</h2>
                        <p>{summary}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
