const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const theatreRoutes = require('./routes/theatreRoutes');
const showRoutes = require('./routes/showRoutes');
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const seatRoutes = require('./routes/seatRoutes');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/', authRoutes);
app.use('/', reservationRoutes);
app.use('/theatres', theatreRoutes);
app.use('/shows', showRoutes);
app.use('/seats', seatRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Theatre Booking API is running'
  });
});

app.get('/db-test', async (req, res) => {
  try {
    const rows = await pool.query('SELECT 1 AS result');
    res.json({
      message: 'Database connection successful',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});