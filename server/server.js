const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const PriceListService = require('./services/priceListService');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

// Connect to database
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter);  // Kaitse ülekoormuse eest

// Import routes
const priceListRoutes = require('./routes/priceList');
const { router: itineraryRoutes } = require('./routes/itinerary');
const routeFinderRoutes = require('./routes/routeFinder');
const reservationRoutes = require('./routes/reservation');

// Use routes
app.use('/api', priceListRoutes);
app.use('/api', routeFinderRoutes);
app.use('/api', itineraryRoutes);
app.use('/api', reservationRoutes);

// Vigade töötlemise middleware
app.use(errorHandler);

// Perioodiline hinnakirja kontroll (iga minut)
let intervalId;
if (process.env.NODE_ENV !== 'test') {
    intervalId = setInterval(async () => {
        try {
            await PriceListService.checkAndUpdatePriceList();
        } catch (error) {
            console.error('Error checking pricelist:', error);
        }
    }, 60000);
}

const PORT = process.env.NODE_ENV === 'test' ? 0 : (process.env.PORT || 5001);

// Põhiline route testimiseks
app.get('/api/test', (req, res) => {
  res.json({ message: 'API on töötanud!' });
});

if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Tühjendus funktsioon testide jaoks
app.cleanup = () => {
    if (intervalId) {
        clearInterval(intervalId);
    }
};

module.exports = app; // Ekspordi app testide jaoks 