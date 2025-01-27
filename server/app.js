const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(rateLimiter);

// Routes
const reservationRouter = require('./routes/reservation');
app.use(reservationRouter);

// Error handling middleware peab olema PÄRAST route'e
app.use(errorHandler);

// Server käivitamine
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 