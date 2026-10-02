const express = require('express');
const router = express.Router();
const db = require('../db');

// Citizen data save karo
router.post('/add', (req, res) => {
  const { user_id, full_name, pincode, address, phone, aadhar_number } = req.body;
  const sql = 'INSERT INTO citizens (user_id, full_name, pincode, address, phone, aadhar_number) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [user_id, full_name, pincode, address, phone, aadhar_number], (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Citizen added successfully!' });
  });
});

// Pincode se citizens dhundo
router.get('/pincode/:pincode', (req, res) => {
  const sql = 'SELECT * FROM citizens WHERE pincode = ?';
  db.query(sql, [req.params.pincode], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;