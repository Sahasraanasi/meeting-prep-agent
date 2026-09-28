const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    company: {
      type: String
    },
    jobTitle: {
      type: String
    },
    email: {
      type: String
    },
    phone: {
      type: String
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Contact', contactSchema);
