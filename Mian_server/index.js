const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Sample Route
app.get('/', (req, res) => {
  res.send('Server is running on Vercel!');
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.verified) return res.status(400).json({ message: 'Invalid credentials or unverified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    res.json({ 
      message: 'Login successful', 
      user: { id: user._id.toString(), username: user.username, wallet: user.wallet } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error during login' });
  }
});



// 🚀 **Important: Export the Express App for Vercel**
module.exports = app;
