
import mongoose from 'mongoose';

export const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: String, required: true }],
  createdAt: { type: Number, default: Date.now }
});

export const ExpenseSchema = new mongoose.Schema({
  groupId: { type: String, required: true },
  payerId: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Number, default: Date.now },
  splitType: { type: String, required: true },
  splits: [{
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    percentage: { type: Number }
  }],
  category: { type: String, default: 'Other' }
});

export const Group = mongoose.model('Group', GroupSchema);
export const Expense = mongoose.model('Expense', ExpenseSchema);
