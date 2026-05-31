const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM theatres');
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch theatres',
      error: error.message
    });
  }
});

module.exports = router;
