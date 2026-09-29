const express = require('express');
const router = express.Router();
const { getTasks, createTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Milestone D: Protect all task routes
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

module.exports = router;