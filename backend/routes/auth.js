const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const Company = require('../models/Company');
const router = express.Router();

// Auth middleware (used for protected routes)
const authMiddleware = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Signup: Auto-create company and admin, set currency based on country

router.post('/signup', async (req, res) => {
  const { email, password, country } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Fetch currency for country
    const countriesResponse = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
    const countryData = countriesResponse.data.find(c => c.name.common.toLowerCase() === country.toLowerCase());
    const currency = countryData ? Object.keys(countryData.currencies)[0] : 'USD';  // Default to USD if not found

    const company = new Company({ currency });
    await company.save();

    const hashedPw = await bcrypt.hash(password, 10);
    user = new User({ 
      email, 
      password: hashedPw, 
      role: 'Admin', 
      isManagerApprover: true, // Admin can approve expenses
      company: company._id 
    });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Create new users (employees/managers), assign roles, managers, isManagerApprover
router.post('/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Unauthorized' });

  const { email, password, role, managerId, isManagerApprover } = req.body;
  try {
    console.log('Creating user:', { email, role, isManagerApprover, managerId });
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const hashedPw = await bcrypt.hash(password, 10);
    
    // Handle manager assignment
    let assignedManager = null;
    
    // Only assign manager if a valid managerId is provided
    if (managerId && managerId.trim() !== '' && managerId.length === 24) {
      assignedManager = managerId;
    } else if (!managerId && role === 'Employee') {
      // If no managerId provided and user is Employee, assign admin as manager
      assignedManager = req.user._id;
    }
    // For Managers, don't assign a manager unless explicitly provided

    user = new User({
      email,
      password: hashedPw,
      role: role || 'Employee',
      manager: assignedManager,
      isManagerApprover: isManagerApprover === true || isManagerApprover === 'true',
      company: req.user.company,  // Same company as admin
    });
    
    console.log('Saving user:', { email, role, isManagerApprover: user.isManagerApprover });
    await user.save();

    res.json({ msg: 'User created', user: { id: user._id, email, role } });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Debug: Get current user info
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('manager', 'email role');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Get all users (for manager selection)
router.get('/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Unauthorized' });
  
  try {
    const users = await User.find({ company: req.user.company })
      .select('_id email role isManagerApprover')
      .sort({ role: 1, email: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Update user (change role, manager, etc.)
router.put('/users/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Unauthorized' });

  const { role, managerId, isManagerApprover } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (role) user.role = role;
    if (managerId) user.manager = managerId;
    if (typeof isManagerApprover !== 'undefined') user.isManagerApprover = isManagerApprover;

    await user.save();
    res.json({ msg: 'User updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;