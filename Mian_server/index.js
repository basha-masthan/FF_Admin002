
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const User = require('./models/User');
const GameMode = require('./models/gameMode');

dotenv.config();
const app = express();
const server = http.createServer(app);

// ✅ Define allowed origins (both local and production)
const allowedOrigins = [
  'https://fbt-gaming-platform.vercel.app'
];

// ✅ Express CORS Middleware (Fixes CORS error)
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));

app.use(express.json());

// ✅ Socket.IO CORS Fix
const io = new Server(server, { 
  cors: { 
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  } 
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// ✅ Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const otps = new Map();

// ==========================================
// Signup - Step 1: Generate and Send OTP
// ==========================================
app.post('/api/signup', async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps.set(email, { otp, data: { username, email, phone, password } });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Free Fire Tournament OTP',
      text: `Your OTP is: ${otp}. Enter it on the website to complete signup.`
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: 'OTP sent to your email. Please verify.' });
  } catch (err) {
    res.status(500).json({ message: 'Error generating OTP', error: err.message });
  }
});

// =========================================
// Signup - Step 2: Verify OTP and Save User
// =========================================
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const storedData = otps.get(email);
    if (!storedData) return res.status(400).json({ message: 'No OTP found for this email' });

    if (storedData.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    const hashedPassword = await bcrypt.hash(storedData.data.password, 10);
    const user = new User({
      username: storedData.data.username,
      email: storedData.data.email,
      phone: storedData.data.phone,
      password: hashedPassword,
      verified: true
    });

    await user.save();
    otps.delete(email);

    res.json({ message: 'Signup completed successfully! You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP', error: err.message });
  }
});

// ==========================================
// User Login
// ==========================================
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

// ==========================================
// Get User Profile Data
// ==========================================
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); 
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// Get All Game Modes
// ==========================================
app.get('/api/game-modes', async (req, res) => {
  try {
    const gameModes = await GameMode.find({ status: 'open' });
    res.json(gameModes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// Add Funds to Wallet
// ==========================================
app.post('/api/wallet/add', async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.wallet = (user.wallet || 0) + amount;
    await user.save();

    res.json({ message: 'Funds added', wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// Book a Slot
// ==========================================
app.post('/api/game-modes/:id/book', async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const gameMode = await GameMode.findById(req.params.id);
    if (!gameMode || gameMode.filledSlots >= gameMode.maxSlots) {
      return res.status(400).json({ error: 'No slots available' });
    }

    if (user.wallet < gameMode.entryFee) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    user.wallet -= gameMode.entryFee;
    await user.save();

    gameMode.filledSlots += 1;
    await gameMode.save();

    io.emit('slotUpdate', gameMode);

    res.json({ message: 'Slot booked successfully', gameMode });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// Socket.IO Connection
// ==========================================
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

// ==========================================
// Start Server
// ==========================================
// server.listen(5000, () => console.log('Server running on port 5000'));




















// ======================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors());

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB Connected Successfully'))
//   .catch(err => console.error('MongoDB Connection Error:', err));

// Sample Route
app.get('/', (req, res) => {
  res.send('Server is running on Vercel By basha');
});

// 🚀 **Important: Export the Express App for Vercel**
module.exports = app;
