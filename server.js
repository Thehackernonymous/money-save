const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/moneytrack');

const transactionSchema = new mongoose.Schema({
  category: String,
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/transactions', async (req, res) => {
  const transactions = await Transaction.find({});
  res.render(__dirname + '/views/transactions.html', { transactions : transactions });
});

app.post('/addTransaction', async (req, res) => {
  const { category, description, amount } = req.body;
  const newTransaction = new Transaction({ category, description, amount });
  await newTransaction.save();
  res.redirect('/transactions');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});