const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const lectureRoutes = require('./routes/lectures');
const courseRoutes = require('./routes/courses');
const reportRoutes = require('./routes/reports');
const ratingsRouter = require("./routes/ratings");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reports', reportRoutes);
app.use("/api/ratings", ratingsRouter);

// ✅ Serve React frontend
const frontendBuildPath = path.join(__dirname, '../reporting-system-frontend/build');

// Serve static files from the React app
app.use(express.static(frontendBuildPath));

// ✅ Catch-all route for React frontend (skip /api routes)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// ✅ Test database connection
app.get('/api/db-test', async (req, res) => {
  try {
    const db = require('./config/db'); // adjust if your DB config path is different
    const [rows] = await db.query("SELECT 1");
    res.json({ success: true, message: "Database connected ✅", rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000; // Ensure this matches your environment
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));