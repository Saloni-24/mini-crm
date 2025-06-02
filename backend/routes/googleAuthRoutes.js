const express = require("express");
const router = express.Router();
const passport = require("../googleAuth/auth"); // Load the Google auth setup

// This route will start the Google login process
// When user goes to this route, Google login page will open
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // We want user's name and email
  })
);

// This route is called after Google login is done
// Google will send the user back here
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // If login fails, send user here
  }),
  (req, res) => {
    // If login is successful, this will run
    res.send(" Google login successful!"); // Send success message
  }
);

module.exports = router;
