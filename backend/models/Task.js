const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String
    },
    dueDate: {
      type: Date
    },
    status: {
      type: String
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Task', taskSchema);