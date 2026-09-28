const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String
    },
    date: {
      type: Date
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact'
    },
    notes: {
      type: String
    },
    summary: {
      type: String
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Meeting', meetingSchema);