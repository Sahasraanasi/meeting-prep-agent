const express = require('express');
const router = express.Router();
const { getMeetings, createMeeting } = require('../controllers/meetingController');

router.route('/')
  .get(getMeetings)
  .post(createMeeting);

module.exports = router;