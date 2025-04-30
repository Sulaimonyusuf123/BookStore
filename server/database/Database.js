const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Only include the non-deprecated options
    await mongoose.connect(process.env.connectDB, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000 // 45 seconds
    });
    
    console.log('Database connected to the port');
    
    // Add error handlers
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
  } catch (err) {
    console.log(err.message);
    process.exit(1); // Exit on connection failure (optional)
  }
};

module.exports = connectDB;