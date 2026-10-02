const express = require('express');
const router = express.Router();
const db = require('../db');

// Complaint add karo
router.post('/add', (req, res) => {
  const { user_id, title, description, category, pincode } = req.body;
  const sql = 'INSERT INTO complaints (user_id, title, description, category, pincode) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [user_id, title, description, category, pincode], (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Complaint submitted successfully!', id: result.insertId });
  });
});

// Sabhi complaints lao
router.get('/all', (req, res) => {
  const sql = 'SELECT * FROM complaints ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Pincode se complaints lao
router.get('/pincode/:pincode', (req, res) => {
  const sql = 'SELECT * FROM complaints WHERE pincode = ? ORDER BY created_at DESC';
  db.query(sql, [req.params.pincode], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Status update karo
router.put('/status/:id', (req, res) => {
  const { status } = req.body;
  const sql = 'UPDATE complaints SET status = ? WHERE id = ?';
  db.query(sql, [status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Status updated!' });
  });
});

module.exports = router;