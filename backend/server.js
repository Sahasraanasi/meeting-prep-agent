const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const contactRoutes = require('./routes/contactRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/contacts', contactRoutes);
app.use('/meetings', meetingRoutes);
app.use('/tasks', taskRoutes);
app.use('/ai', aiRoutes);
app.use('/auth', authRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Meeting Prep Agent Backend API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});