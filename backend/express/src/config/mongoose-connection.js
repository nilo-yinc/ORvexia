const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/workflow_system';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.warn('Server will continue without database connection. Some features may not work.');
    // Don't exit - allow server to run without DB for development
  }
};

module.exports = connectDB;
