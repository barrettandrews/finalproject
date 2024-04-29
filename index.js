const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');

// Set a cost factor for bcrypt (higher is more secure but slower)
const SALT_ROUNDS = 10;

// CREATE a new user with hashed password
router.post('/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error creating user' });
      }
      res.status(201).json({ message: 'User created', userId: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during user creation' });
  }
});

// GET all users
router.get('/users', (req, res) => {
  const sql = `SELECT id, username, email, created_at FROM users`; // Avoid returning hashed passwords

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching users' });
    }
    res.status(200).json(results);
  });
});

// GET a specific user by ID
router.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const sql = `SELECT id, username, email, created_at FROM users WHERE id = ?`; // Avoid returning hashed passwords

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching user' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(results[0]);
  });
});

// UPDATE a user by ID
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, password } = req.body;

    // Hash the new password, if provided
    const hashedPassword = password ? await bcrypt.hash(password, SALT_ROUNDS) : null;

    const sql = `UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?`;

    db.query(sql, [username, email, hashedPassword, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating user' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found or update failed' });
      }

      res.status(200).json({ message: 'User updated' });
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during user update' });
  }
});

// DELETE a user by ID
router.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const sql = `DELETE FROM users WHERE id = ?`;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting user' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found or delete failed' });
    }

    res.status(200).json({ message: 'User deleted' });
  });
});

module.exports = router;