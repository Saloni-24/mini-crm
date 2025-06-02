const User = require('../data/user'); // 
// Importing user file
const userHandlers = require('../handlers/userHandlers');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// prevents writing error function again and again 
const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({ msg: message });
};

// function to add new user
const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // message in case any field remained empty
    if (!name || !email || !password) {
      return sendError(res, 400, "fill every detail!");
    }

    // to check if mail is already registered 
    const alreadyThere = await User.findOne({ email });
    if (alreadyThere) {
      return sendError(res, 409, "This mail is already registered.");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // to save data of new user in database
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Send response without password field
    const userToReturn = { _id: newUser._id, name: newUser.name, email: newUser.email };

    res.status(201).json({
      msg: "✅ User successfully added!",
      user: userToReturn,
    });

  } catch (err) {
    console.log("⚠️ Error while adding user:", err);
    return sendError(res, 500, "😔 Try again later!");
  }
};

// function to show all users and for accessing 
const showUsers = async (req, res) => {
  try {
    // exclude password from response
    const allUsers = await User.find({}, '-password');
    res.status(200).json(allUsers);
  } catch (err) {
    console.log("⚠️ Error while fetching users:", err);
    return sendError(res, 500, "problem in finding users.");
  }
};

// function to let user login 
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return sendError(res, 400, "fill both the details !");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 401, "Sign up first!");
    }

    // to check password entered by user is correct or not using bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return sendError(res, 401, "Incorrect Password!");
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email ,username: user.name,role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    // Send response without password and with token
    const userToReturn = { _id: user._id, name: user.name, email: user.email,role: user.role, };

    res.status(200).json({
      msg: "Login successful! Welcome back 👋",
      user: userToReturn,
      token,
    });
  } catch (err) {
    console.log("⚠️ Login error:", err);
    return sendError(res, 500, "Server is Unreachable.Try again later.");
  }
};

// Exporting both functions
module.exports = {
  addUser,
  showUsers,
  loginUser,
};
