const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { sendWelcomeEmail } = require('../mailer');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, pincode } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password, pincode) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, pincode || ""], async (err, result) => {
      if (err) {
        console.error('Register error:', err);
        return res.status(400).json({ error: 'Email already exists' });
      }
      try {
        await sendWelcomeEmail(email, name);
      } catch (mailErr) {
        console.error('Email error:', mailErr);
      }
      res.json({ message: 'User registered successfully!' });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0)
      return res.status(400).json({ error: 'User not found' });
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Wrong password' });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        pincode: user.pincode || ""
      }
    });
  });
});

module.exports = router;