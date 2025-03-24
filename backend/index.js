require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const SECRET_KEY = "your_secret_key"; // Change to a secure key

app.use(cors());
app.use(bodyParser.json());

// cors middleware


app.use(cors({ 
    origin: ["http://localhost:5173"],
    credentials: true 
}));


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: null }, // Admin/User
  industry: { type: String, default: null },
  onboardingComplete: { type: Boolean, default: false },
});
const User = mongoose.model("User", userSchema);

// Task Schema (For CRUD)
const taskSchema = new mongoose.Schema({
  title: String,
  status: { type: String, default: "Pending" },
  userId: mongoose.Schema.Types.ObjectId, // Link task to user
});
const Task = mongoose.model("Task", taskSchema);

// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

// Signup API
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    onboardingComplete: false,
  });
  await newUser.save();

  const token = jwt.sign({ userId: newUser._id, email }, SECRET_KEY, {
    expiresIn: "1h",
  });
  res.json({ userId: newUser._id, token });
});

// Login API
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // ✅ Return 404
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    const token = jwt.sign({ userId: user._id, email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ userId: user._id, token });
  });
  

// Get Profile API
app.get("/api/auth/profile", authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    industry: user.industry,
    onboardingComplete: user.onboardingComplete,
  });
});

// Save User Onboarding Data API
app.post("/api/users/onboarding", authenticateToken, async (req, res) => {
  const { role, industry } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { role, industry, onboardingComplete: true },
    { new: true }
  );

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ success: true, message: "Onboarding completed successfully!" });
});

// Fetch Analytics Data API
app.get("/api/analytics", authenticateToken, (req, res) => {
  const mockAnalyticsData = {
    totalUsers: 500,
    activeUsers: 120,
    sales: 10000,
    growth: 10,
  };

  res.json(mockAnalyticsData);
});

// AI-Generated Summary API
app.post("/api/summary", authenticateToken, (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ message: "No analytics data provided" });
  }

  // Mocked AI-generated response
  const summary = `User activity increased by ${data.growth}% this month. Total sales reached $${data.sales}, with ${data.activeUsers} active users.`;

  res.json({ summary });
});

// ===== CRUD Operations for Tasks =====

// Get All Tasks 
app.get("/api/tasks", authenticateToken, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.userId });
  res.json(tasks);
});

// Add New Task
app.post("/api/tasks", authenticateToken, async (req, res) => {
  const { title } = req.body;

  if (!title)
    return res.status(400).json({ message: "Task title is required" });

  const newTask = new Task({
    title,
    status: "Pending",
    userId: req.user.userId,
  });
  await newTask.save();

  res.json(newTask);
});

// Update Task Title & Status
app.put("/api/tasks/:id", authenticateToken, async (req, res) => {
    const { status, title } = req.body;
    const updateFields = {};
  
    if (status) updateFields.status = status;
    if (title) updateFields.title = title; // ✅ Allow title updates
  
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      updateFields,
      { new: true }
    );
  
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
  
    res.json(updatedTask);
  });
  

// Delete Task
app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
  const deletedTask = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId,
  });

  if (!deletedTask) return res.status(404).json({ message: "Task not found" });

  res.json({ success: true, message: "Task deleted successfully" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
