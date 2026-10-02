const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/all', (req, res) => {
  const sql = `
    SELECT p.id, p.title, p.description, p.tag, 
           po.id as option_id, po.label, po.votes 
    FROM polls p 
    LEFT JOIN poll_options po ON p.id = po.poll_id
    ORDER BY p.id, po.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const pollsMap = {};
    results.forEach((row) => {
      if (!pollsMap[row.id]) {
        pollsMap[row.id] = {
          id: row.id,
          title: row.title,
          description: row.description,
          tag: row.tag,
          options: []
        };
      }
      if (row.option_id) {
        pollsMap[row.id].options.push({
          id: row.option_id,
          label: row.label,
          votes: row.votes
        });
      }
    });
    res.json(Object.values(pollsMap));
  });
});

router.post('/vote', (req, res) => {
  const { poll_id, option_id, user_id } = req.body;
  const checkSql = 'SELECT * FROM poll_votes WHERE poll_id = ? AND user_id = ?';
  db.query(checkSql, [poll_id, user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ error: 'Already voted' });
    const voteSql = 'INSERT INTO poll_votes (poll_id, option_id, user_id) VALUES (?, ?, ?)';
    db.query(voteSql, [poll_id, option_id, user_id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      const updateSql = 'UPDATE poll_options SET votes = votes + 1 WHERE id = ?';
      db.query(updateSql, [option_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Vote submitted!' });
      });
    });
  });
});

router.post('/create', (req, res) => {
  const { title, description, tag, options } = req.body;
  const pollSql = 'INSERT INTO polls (title, description, tag) VALUES (?, ?, ?)';
  db.query(pollSql, [title, description, tag], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const pollId = result.insertId;
    const optionValues = options.map((label) => [pollId, label]);
    const optionSql = 'INSERT INTO poll_options (poll_id, label) VALUES ?';
    db.query(optionSql, [optionValues], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Poll created!', pollId });
    });
  });
});

module.exports = router;