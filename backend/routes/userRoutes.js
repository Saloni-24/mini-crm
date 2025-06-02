
// importing express package whcih performs the task of routing and server
const express = require('express');

//creating a small router of express where we will store our address 
const router = express.Router();

// importing middlewares for authentication and admin check
const { protect, isAdmin } = require("../middleware/authMiddleware");

// importing user related functions 
const userHandlers = require('../handlers/userHandlers');

// importing signup data to add userfunction
router.post('/signup', (req, res) => {
  userHandlers.addUser(req, res);
});
// when a person tries to login login userfunction will check the user
router.post('/login', (req, res) => {
  userHandlers.loginUser(req, res);
});

// when we have to get list of all users
router.get('/', (req, res) => {
  userHandlers.showUsers(req, res);
});

// ✅ Protected Route: Normal user dashboard
router.get("/dashboard", protect, (req, res) => {
  res.json({ msg: `Hello ${req.user.username} ! Welcome to dashboard.` });
});

// ✅ Admin-only Route: Admin panel
router.get("/admin", protect, isAdmin, (req, res) => {
  res.json({ msg: "🛡️ Welcome Admin, this is your panel." });
});


// to export in other files
module.exports = router;
