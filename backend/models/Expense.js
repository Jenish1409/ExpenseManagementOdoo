const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  originalAmount: { type: Number },  // If different currency
  originalCurrency: { type: String },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  approvers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approved: { type: Boolean },
    comments: { type: String },
    sequence: { type: Number }  // For multi-level order
  }],
  // For conditional rules (configured by admin, e.g., in company or separate model)
  requiredPercentage: { type: Number, default: 0 },  // e.g., 60 for 60%
  specificApprover: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // e.g., CFO
});

module.exports = mongoose.model('Expense', expenseSchema);
