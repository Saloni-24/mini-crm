// Required modules 
const express = require("express");
const dotenv = require("dotenv");

// MongoDB connection file import//
 const connectDB = require("./db/connect");

 //userRouter file import
 const userRouter = require("./routes/userRoutes");

 const customerRoutes = require('./routes/customerRoutes');

 const orderRoutes = require('./routes/orderRoutes');


// loading.env file
dotenv.config();

// Connect to MongoDB
connectDB();

// creating an express app
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Use user routes under /api/auth
app.use("/api/auth", userRouter); // route use

app.use('/api/customers', customerRoutes); 

app.use('/api/orders', orderRoutes);


// importing user related functions 
//const userHandlers = require('../handlers/userHandlers');//


// Port number loaded env file or by default 5000
const PORT = process.env.PORT || 5000;

// Basic route created to check server
app.get("/", (req, res) => {
  res.send("Hello! Mini CRM backend is running fine ");
});

// starting the server
app.listen(PORT, () => {
  console.log("🎉 Server is running  -> http://localhost:" + PORT);
});
