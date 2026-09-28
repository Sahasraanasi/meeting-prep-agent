const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Meeting title is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Meeting date is required']
    },
    contactId: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Contact',
      default: null
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    summary: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Meeting', meetingSchema);