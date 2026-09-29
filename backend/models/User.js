const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    username: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      unique: true
    },
    password: {
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