const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/user/reservations', authenticateToken, async (req, res) => {
  try {
    const rows = await pool.query(
      `
      SELECT 
        reservations.reservation_id,
        reservations.status,
        reservations.total_price,
        reservations.created_at,
        shows.title,
        showtimes.show_date,
        showtimes.show_time,
        showtimes.hall
      FROM reservations
      JOIN showtimes 
        ON reservations.showtime_id = showtimes.showtime_id
      JOIN shows 
        ON showtimes.show_id = shows.show_id
      WHERE reservations.user_id = ?
      ORDER BY reservations.created_at DESC
      `,
      [req.user.userId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch user reservations',
      error: error.message
    });
  }
});

router.post('/reservations', authenticateToken, async (req, res) => {
  let connection;

  try {
    const { showtimeId, seatIds } = req.body;

    if (!showtimeId || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({
        message: 'Showtime ID and at least one seat ID are required'
      });
    }

    const uniqueSeatIds = [...new Set(seatIds)];

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const placeholders = uniqueSeatIds.map(() => '?').join(',');

    const seats = await connection.query(
      `
      SELECT
        seat_id,
        showtime_id,
        price,
        is_reserved
      FROM seats
      WHERE showtime_id = ?
        AND seat_id IN (${placeholders})
      FOR UPDATE
      `,
      [showtimeId, ...uniqueSeatIds]
    );

    if (seats.length !== uniqueSeatIds.length) {
      await connection.rollback();

      return res.status(400).json({
        message: 'One or more selected seats do not belong to this showtime'
      });
    }

    const hasReservedSeat = seats.some(
      (seat) => Number(seat.is_reserved) === 1
    );

    if (hasReservedSeat) {
      await connection.rollback();

      return res.status(409).json({
        message: 'One or more selected seats are already reserved'
      });
    }

    const totalPrice = seats.reduce(
      (sum, seat) => sum + Number(seat.price),
      0
    );

    const reservationResult = await connection.query(
      `
      INSERT INTO reservations (
        user_id,
        showtime_id,
        total_price
      )
      VALUES (?, ?, ?)
      `,
      [req.user.userId, showtimeId, totalPrice]
    );

    const reservationId = Number(reservationResult.insertId);

    for (const seatId of uniqueSeatIds) {
      await connection.query(
        `
        INSERT INTO reservation_seats (
          reservation_id,
          seat_id
        )
        VALUES (?, ?)
        `,
        [reservationId, seatId]
      );
    }

    await connection.query(
      `
      UPDATE seats
      SET is_reserved = TRUE
      WHERE seat_id IN (${placeholders})
      `,
      uniqueSeatIds
    );

    await connection.commit();

    res.status(201).json({
      message: 'Reservation created successfully',
      reservationId,
      totalPrice
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    res.status(500).json({
      message: 'Failed to create reservation',
      error: error.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.delete('/reservations/:id', authenticateToken, async (req, res) => {
  let connection;

  try {
    const reservationId = req.params.id;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const reservations = await connection.query(
      `
      SELECT
        reservation_id,
        status
      FROM reservations
      WHERE reservation_id = ?
        AND user_id = ?
      FOR UPDATE
      `,
      [reservationId, req.user.userId]
    );

    if (reservations.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: 'Reservation not found'
      });
    }

    if (reservations[0].status === 'cancelled') {
      await connection.rollback();

      return res.status(400).json({
        message: 'Reservation is already cancelled'
      });
    }

    const reservedSeats = await connection.query(
      `
      SELECT seat_id
      FROM reservation_seats
      WHERE reservation_id = ?
      `,
      [reservationId]
    );

    const seatIds = reservedSeats.map((seat) => seat.seat_id);

    if (seatIds.length > 0) {
      const placeholders = seatIds.map(() => '?').join(',');

      await connection.query(
        `
        UPDATE seats
        SET is_reserved = FALSE
        WHERE seat_id IN (${placeholders})
        `,
        seatIds
      );
    }

    await connection.query(
      `
      UPDATE reservations
      SET status = ?
      WHERE reservation_id = ?
        AND user_id = ?
      `,
      ['cancelled', reservationId, req.user.userId]
    );

    await connection.commit();

    res.json({
      message: 'Reservation cancelled successfully'
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    res.status(500).json({
      message: 'Failed to cancel reservation',
      error: error.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;