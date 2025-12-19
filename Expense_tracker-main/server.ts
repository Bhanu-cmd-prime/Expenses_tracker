
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Fix: Cast cors() and express.json() to any to resolve Type compatibility issues between @types/cors, @types/body-parser and @types/express middleware signatures
app.use(cors() as any);
app.use(express.json() as any);

// MongoDB Connection
// Updated with the provided Atlas connection string. Note: Special characters like # usually 
// need to be URL encoded if connection fails, but we use the string exactly as provided.
const MONGODB_URI = 'mongodb+srv://TrineshCh:Trinesh#3699@cluster0.uhepc.mongodb.net/?appName=Cluster0'; 

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Models
const GroupSchema = new mongoose.Schema({
  name: String,
  members: [String],
  createdAt: { type: Number, default: Date.now }
});

const ExpenseSchema = new mongoose.Schema({
  groupId: String,
  payerId: String,
  description: String,
  amount: Number,
  date: { type: Number, default: Date.now },
  splitType: String,
  splits: [{
    userId: String,
    amount: Number,
    percentage: Number
  }],
  category: String
});

const Group = mongoose.model('Group', GroupSchema);
const Expense = mongoose.model('Expense', ExpenseSchema);

// API Routes
app.get('/api/groups', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

app.post('/api/groups', async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});

app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});