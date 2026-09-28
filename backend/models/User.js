const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String
    },
    company: {
      type: String
    },
    role: {
      type: String
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('User', userSchema);