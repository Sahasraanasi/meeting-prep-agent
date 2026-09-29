const express = require('express');
const router = express.Router();
const { getMeetings, createMeeting } = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

// Milestone D: Protect all meeting routes
router.use(protect);

router.route('/')
  .get(getMeetings)
  .post(createMeeting);

module.exports = router;