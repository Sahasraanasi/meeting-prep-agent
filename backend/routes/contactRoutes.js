const express = require('express');
const router = express.Router();
const { getContacts, createContact } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// Milestone D: Protect all contact routes
router.use(protect);

router.route('/')
  .get(getContacts)
  .post(createContact);

module.exports = router;