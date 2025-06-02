 require('dotenv').config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../data/user");  // Import your User model

// Save user id to session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Get user from session by id
passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google login setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,         // Your Google Client ID
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Google Client Secret
    callbackURL: "/auth/google/callback",           // Where Google sends the user after login
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      // Check if user already exists in database
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // If user found, return user
        return done(null, user);
      }

      // If user not found, create new user
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      });

      await user.save();  // Save user in database
      done(null, user);   // Return new user

    } catch (err) {
      done(err, null);    // Return error if any
    }
  }
));

module.exports = passport;
