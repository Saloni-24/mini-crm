// Required modules 
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");   //secures  app by setting HTTP headers
const cors = require("cors");    //It allows frontend app to access backend APIs safely  

// MongoDB connection 
const connectDB = require("./db/connect");

// Route files import
const userRouter = require("./routes/userRoutes");
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const campaignRoutes = require('./routes/campaignRoutes');  // Campaign routes

// Loading env variables
dotenv.config();

// Connection to MongoDB
connectDB();

// Creation of express app
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// using  helmet and cors middleware
app.use(helmet());
app.use(cors());

// Using routes
app.use("/api/auth", userRouter);      // User auth routes
app.use('/api/customers', customerRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/campaign', campaignRoutes);  // Campaign routes

// function to check server
app.get("/", (req, res) => {
  res.send("Hello! Mini CRM backend is running fine");
});

//  server started
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🎉 Server is running -> http://localhost:" + PORT);
});
