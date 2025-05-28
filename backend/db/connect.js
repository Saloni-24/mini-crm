const mongoose = require('mongoose');

// Function to connect to MongoDB database
const connectDB = async () => { // 
  try {
    // Connect to MongoDB using connection string from environment variables
    console.log("🔍 Using MONGO_URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
     // useNewUrlParser: true,    //for  Using new URL parser for MongoDB connection 
      //useUnifiedTopology: true, // for using new Server Discover and Monitoring engine to avoid outdated depraciated warnings
    
    console.log("MongoDB connected"); // Success message
  } catch (error) {
    // If connection fails, log error and stop the app
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB; // Export function to use in other files
