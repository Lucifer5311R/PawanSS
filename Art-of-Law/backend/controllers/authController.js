const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // For jwt.verify

// Utility to sign JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Utility to create and send token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.registerUser = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, altPhone, street, city, state, zip, country,
      dob, gender, occupation, govtId, password, confirmPassword
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ status: 'fail', message: 'Passwords do not match' });
    }

    const newUser = await User.create({
      firstName, lastName, email, phone, altPhone, street, city, state, zip, country,
      dob, gender, occupation, govtId, password
      // Add other fields from req.body as needed like caseCategory, referral, etc.
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    console.error('Error registering user:', error);
    if (error.code === 11000) { // Duplicate key error (email)
        return res.status(400).json({ status: 'fail', message: 'Email already exists.' });
    }
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ status: 'fail', message: messages.join('. ') });
    }
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password!' });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password'); // Explicitly select password

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// Optional: Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'You are not logged in! Please log in to get access.' });
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ status: 'fail', message: 'The user belonging to this token does no longer exist.'});
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    console.error('Auth protect error:', error);
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ status: 'fail', message: 'Invalid token. Please log in again.' });
    if (error.name === 'TokenExpiredError') return res.status(401).json({ status: 'fail', message: 'Your token has expired! Please log in again.' });
    res.status(500).json({ status: 'error', message: 'Something went wrong.' });
  }
};