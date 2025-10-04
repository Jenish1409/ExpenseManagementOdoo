const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const Expense = require('../models/Expense');
const User = require('../models/User');
const Company = require('../models/Company');
const router = express.Router();

// Auth middleware (copy from auth.js or make separate file; for now, duplicate)
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

// Submit expense (Employee/Manager)
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role === 'Admin') return res.status(403).json({ msg: 'Admins cannot submit expenses' });

  const { amount, currency, category, description, date } = req.body;
  try {
    const company = await Company.findById(req.user.company);

    let convertedAmount = amount;
    if (currency !== company.currency) {
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
      const rate = response.data.rates[company.currency];
      if (!rate) return res.status(400).json({ msg: 'Invalid currency conversion' });
      convertedAmount = amount * rate;
    }

    const expense = new Expense({
      user: req.user._id,
      amount: convertedAmount,
      originalAmount: amount,
      originalCurrency: currency,
      category,
      description,
      date,
    });

    // Add initial approver (manager if isManagerApprover checked)
    if (req.user.manager) {
      const manager = await User.findById(req.user.manager);
      if (manager && manager.isManagerApprover) {
        expense.approvers.push({ user: manager._id, sequence: 1 });
      }
    }
    // TODO: Add more approvers based on admin-configured rules (expand later)

    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// View my expenses (Employee/Manager)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).populate('approvers.user', 'email');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// View pending approvals (Manager/Admin)
router.get('/pending', authMiddleware, async (req, res) => {
  if (req.user.role === 'Employee') return res.status(403).json({ msg: 'Unauthorized' });
  try {
    const expenses = await Expense.find({
      'approvers.user': req.user._id,
      status: 'Pending'
    }).populate('user', 'email');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Approve/Reject (Manager/Admin)
router.put('/:id/approve', authMiddleware, async (req, res) => {
  const { approve, comments } = req.body;
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    const approver = expense.approvers.find(a => a.user.toString() === req.user._id.toString());
    if (!approver) return res.status(403).json({ msg: 'Not authorized to approve this' });

    approver.approved = approve;
    approver.comments = comments;

    // Check if all in sequence approved or conditional met
    const approvedCount = expense.approvers.filter(a => a.approved === true).length;
    const totalApprovers = expense.approvers.length;

    let isApproved = false;
    if (expense.specificApprover && expense.approvers.some(a => a.user.toString() === expense.specificApprover.toString() && a.approved)) {
      isApproved = true;
    } else if (expense.requiredPercentage > 0 && (approvedCount / totalApprovers) * 100 >= expense.requiredPercentage) {
      isApproved = true;
    } else if (approvedCount === totalApprovers) {
      isApproved = true;  // All approved
    }

    if (isApproved) {
      expense.status = 'Approved';
    } else if (expense.approvers.some(a => a.approved === false)) {
      expense.status = 'Rejected';
    } else {
      // Move to next in sequence (mock notification)
    }

    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: View all expenses
router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Unauthorized' });
  try {
    const expenses = await Expense.find().populate('user', 'email').populate('approvers.user', 'email');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Configure conditional rules for an expense (or globally, but per expense for simplicity)
router.put('/:id/rules', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Unauthorized' });
  const { requiredPercentage, specificApprover, approvers } = req.body;  // approvers: array of {userId, sequence}
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    if (requiredPercentage) expense.requiredPercentage = requiredPercentage;
    if (specificApprover) expense.specificApprover = specificApprover;
    if (approvers) {
      expense.approvers = approvers.map((a, index) => ({ user: a.userId, sequence: index + 1 }));
    }

    await expense.save();
    res.json({ msg: 'Rules updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
