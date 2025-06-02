const bcrypt = require("bcrypt"); // to do  encryption of password
const jwt = require("jsonwebtoken"); // to verify password 
const User = require("../data/user"); // <-- User model import
 const { username, password, role } = req.body;

// SIGNUP function to handle signup request
const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    //  to Check if user already exists in DB
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Encrypt password
    const salt = 10; // salt=10 means 10 rounds of hash ...more no rounds:-more security
    const securePassword = await bcrypt.hash(password, salt); // 

    // Save new user to database
    const newUser = new User({ username, password: securePassword });
    await newUser.save();

    console.log(`✅ User registered: ${username}`);
    res.status(201).json({ message: "Signup successful!" });

  } catch (error) {
    console.log("⚠️ Signup error:", error.message);
    res.status(500).json({ message: "Server error during signup." });
  }
};

// --- LOGIN ---
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Finding user in DB
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Compare password with encrypted password stored in db
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password!" });
    }

    // Generate JWT token token =login proof
    const token = jwt.sign(
      { userId: user._id, username: user.username ,role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`✅ Logged in: ${username}`);
    res.json({ message: "Login successful!", token });

  } catch (error) {
    console.log("⚠️ Login error:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
};

module.exports = { signup, login };
