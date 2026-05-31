const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const rows = await pool.query(`
      SELECT 
        shows.show_id,
        shows.title,
        shows.description,
        shows.duration,
        shows.age_rating,
        theatres.name AS theatre_name,
        theatres.location
      FROM shows
      JOIN theatres ON shows.theatre_id = theatres.theatre_id
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch shows',
      error: error.message
    });
  }
});

router.get('/showtimes', async (req, res) => {
  try {
    const rows = await pool.query(`
      SELECT 
        showtimes.showtime_id,
        showtimes.show_id,
        shows.title,
        showtimes.show_date,
        showtimes.show_time,
        showtimes.hall,
        showtimes.base_price
      FROM showtimes
      JOIN shows ON showtimes.show_id = shows.show_id
      ORDER BY showtimes.show_date, showtimes.show_time
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch showtimes',
      error: error.message
    });
  }
});

module.exports = router;
