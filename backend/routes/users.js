const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const emailService = require('../services/emailServiceFallback');

// In-memory storage for OTPs (in production, use Redis or database)
const otpStorage = new Map();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Check if user is trying to register with a Google-linked email
    const existingGoogleUser = await User.findOne({ email, googleId: { $exists: true, $ne: null } });
    if (existingGoogleUser) {
      return res.status(400).json({ msg: 'An account with this email already exists with Google. Please log in with Google.' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if user has a Google-linked account
    if (user.googleId) {
      return res.status(400).json({ msg: 'An account with this email exists with Google. Please log in with Google.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/google-login
// @desc    Authenticate user with Google and get token
// @access  Public
router.post('/google-login', async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { name, email, sub: googleId } = ticket.getPayload();

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        name,
        email,
        googleId
      });

      await user.save();
    } else {
      // Update googleId if not already set
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    // Return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '5 days' },
      (err, jwtToken) => {
        if (err) throw err;
        res.json({ token: jwtToken });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/send-otp
// @desc    Send OTP to user's email
// @access  Public
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email
    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }
    
    // Rate limiting: Check if user requested OTP recently
    const storedOtp = otpStorage.get(email);
    if (storedOtp && Date.now() - (storedOtp.expires - 5 * 60 * 1000) < 60 * 1000) {
      return res.status(429).json({ msg: 'Please wait before requesting another OTP' });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiration (5 minutes)
    otpStorage.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    });
    
    // Try to send email, but always log OTP to console for testing
    let emailSent = false;
    try {
      const emailResult = await emailService.sendOtpEmail(email, otp);
      emailSent = emailResult.success;
    } catch (emailError) {
      console.log('Email service not available, OTP logged to console');
    }
    
    // ALWAYS log OTP to console (important for testing)
    console.log('\n===========================================');
    console.log('📧 OTP CODE FOR TESTING');
    console.log('===========================================');
    console.log(`Email: ${email}`);
    console.log(`OTP Code: ${otp}`);
    console.log('Expires in 5 minutes');
    console.log('===========================================\n');
    
    res.json({ msg: 'OTP sent successfully' });
  } catch (err) {
    console.error('Send OTP error:', err.message);
    res.status(500).json({ msg: 'Server error. Please try again.' });
  }
});

// @route   POST api/users/verify-otp
// @desc    Verify OTP and login/register user
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, name } = req.body;
    
    // Validate inputs
    if (!email || !otp) {
      return res.status(400).json({ msg: 'Email and OTP are required' });
    }
    
    // Check if OTP exists and is valid
    const storedOtp = otpStorage.get(email);
    if (!storedOtp) {
      return res.status(400).json({ msg: 'OTP not found or expired' });
    }
    
    // Check expiration
    if (Date.now() > storedOtp.expires) {
      otpStorage.delete(email);
      return res.status(400).json({ msg: 'OTP has expired' });
    }
    
    // Verify OTP
    if (storedOtp.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }
    
    // OTP is valid, remove it
    otpStorage.delete(email);
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user if registering
      if (!name) {
        return res.status(400).json({ msg: 'Name is required for registration' });
      }
      
      user = new User({
        name,
        email,
        // No password needed for OTP login
      });
      
      await user.save();
    }
    
    // Return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;