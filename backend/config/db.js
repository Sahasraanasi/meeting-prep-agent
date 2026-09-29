const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        console.log('Using in-memory MongoDB instance successfully.');
      } catch (memErr) {
        console.error('MongoMemoryServer failed:', memErr.message);
      }
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;