import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "./redux/authSlice";
import Navbar from "./components/Navbar"; // ✅ Import Navbar
import Signup from "./components/Signup";
import Login from "./components/Login";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import TaskManager from "./components/TaskManager";
import Profile from "./components/Profile"; // ✅ Import Profile Component

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);

  return (
    <Router>
      {token && <Navbar />} {/* ✅ Show Navbar only when logged in */}

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/onboarding"
          element={
            <PrivateRoute>
              {!loading && user?.onboardingComplete ? (
                <Navigate to="/dashboard" />
              ) : (
                <Onboarding />
              )}
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {user?.onboardingComplete ? (
                <Dashboard />
              ) : (
                <Navigate to="/onboarding" />
              )}
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              {user?.onboardingComplete ? (
                <TaskManager />
              ) : (
                <Navigate to="/onboarding" />
              )}
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Default Redirect */}
        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
