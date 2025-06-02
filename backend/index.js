// Required modules 
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");   // secures app by setting HTTP headers
const cors = require("cors");       // It allows frontend app to access backend APIs safely  
const session = require("express-session");  // for Google login session
const passport = require("passport");        // for Google OAuth

// MongoDB connection 
const connectDB = require("./db/connect");

// Route files import
const userRouter = require("./routes/userRoutes");
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const campaignRoutes = require('./routes/campaignRoutes');  // Campaign routes
const authRoutes = require('./routes/googleAuthRoutes');  // Google OAuth routes

// Loading env variables
dotenv.config();

// Connection to MongoDB
connectDB();

// Creation of express app
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// using helmet and cors middleware
app.use(helmet());
app.use(cors());

// EXPRESS SESSION SETUP FOR Google OAuth 
// This is needed so passport can keep user info in session
app.use(session({
  secret: process.env.SESSION_SECRET || 'chhupa_secret_yeh_rakho',
  resave: false,
  saveUninitialized: false,
}));

// PASSPORT INITIALIZE 
// These lines are required for Google OAuth to work
app.use(passport.initialize());
app.use(passport.session()); // Even if using JWT later, this is needed for OAuth flow

// Using routes
app.use("/api/auth", userRouter);           // User auth routes
app.use('/api/customers', customerRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/campaigns', campaignRoutes);  // Campaign routes
app.use('/auth', authRoutes);               // Google OAuth routes

// function to check server
app.get("/", (req, res) => {
  res.send("Hello! Mini CRM backend is running fine");
});

//  routes added below for login & dashboard testing with OAuth

app.get('/login', (req, res) => {
  res.send('Login failed, please try again or use another account.');
});

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome ${req.user.name}, you are logged in via Google OAuth!`);
  } else {
    res.redirect('/login');
  }
});

// server started
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🎉 Server is running -> http://localhost:" + PORT);
});
