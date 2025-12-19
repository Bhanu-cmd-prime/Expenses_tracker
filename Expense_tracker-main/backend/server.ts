
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Group, Expense } from './models.js';

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors() as any);
app.use(express.json() as any);

// MongoDB Connection
// Note: Special characters in passwords (like #) are handled by the driver, 
// but we use the exact string provided.
const MONGODB_URI =
  "mongodb+srv://TrineshCh:Trinesh%403699@cluster0.uhepc.mongodb.net/splitsmart?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

/**
 * API Routes
 */

// Fetch all groups
app.get('/api/groups', async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Create a new group
app.post('/api/groups', async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Fetch all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Create a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
