import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Determine API Base URL
const API_BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://dashboardapi-1xma.onrender.com";

// Load token from localStorage
const token = localStorage.getItem("token");

// ✅ Signup Action (Async Thunk)
export const signupUser = createAsyncThunk("auth/signupUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, userData);
        localStorage.setItem("token", response.data.token); // Store JWT
        return response.data; // { userId, token }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
});

// ✅ Login Action (Async Thunk)
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, userData);
        localStorage.setItem("token", response.data.token); // Store JWT
        return response.data; // { userId, token }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
});

// ✅ Fetch Profile Action
export const fetchProfile = createAsyncThunk("auth/fetchProfile", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
});

// ✅ Save Onboarding Data
export const saveOnboarding = createAsyncThunk("auth/saveOnboarding", async (onboardingData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_BASE_URL}/api/users/onboarding`, onboardingData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Onboarding failed");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: token || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(saveOnboarding.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveOnboarding.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, onboardingComplete: true };
            })
            .addCase(saveOnboarding.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
