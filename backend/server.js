const express = require('express');
const cors = require('cors');

const contactRoutes = require('./routes/contactRoutes');
const meetingRoutes = require('./routes/meetingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/contacts', contactRoutes);
app.use('/meetings', meetingRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Meeting Prep Agent Backend API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});