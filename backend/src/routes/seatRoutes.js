const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const { showtimeId } = req.query;

    if (!showtimeId) {
      return res.status(400).json({
        message: 'Showtime ID is required'
      });
    }

    const seats = await pool.query(
      `
      SELECT
        seat_id,
        showtime_id,
        seat_row,
        seat_number,
        category,
        price,
        is_reserved
      FROM seats
      WHERE showtime_id = ?
      ORDER BY seat_row, seat_number
      `,
      [showtimeId]
    );

    res.json(seats);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch seats',
      error: error.message
    });
  }
});

module.exports = router;