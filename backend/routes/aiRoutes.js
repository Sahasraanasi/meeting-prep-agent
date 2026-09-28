const express = require('express');
const router = express.Router();

const {
  getSummary,
  getTasks,
  getBrief
} = require('../controllers/aiController');

router.post('/summary', getSummary);
router.post('/tasks', getTasks);
router.post('/brief', getBrief);

module.exports = router;