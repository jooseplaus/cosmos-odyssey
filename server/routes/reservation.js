const express = require('express');
const router = express.Router();
const reservationService = require('../services/reservationService');
const PriceList = require('../models/PriceList');
const validateReservation = require('../middleware/validateReservation');
const Reservation = require('../models/Reservation');

// Reservatsiooni loomine
router.post('/reservations', async (req, res) => {
    try {
        console.log('POST /reservations - Saabus päring, flights info:', JSON.stringify(req.body.flights, null, 2));
        
        const reservation = new Reservation({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            routes: req.body.routes,
            totalPrice: req.body.totalPrice,
            totalDuration: req.body.totalDuration,
            companies: req.body.companies,
            flights: req.body.flights.map(flight => ({
                flightNumber: flight.flightNumber,
                from: flight.from,
                to: flight.to,
                company: flight.company,
                startTime: flight.startTime || flight.departure,
                endTime: flight.endTime || flight.arrival,
                distance: flight.distance,
                price: flight.price
            }))
        });
        
        console.log('Loodud reservation objekt flights:', JSON.stringify(reservation.flights, null, 2));
        const savedReservation = await reservation.save();
        console.log('MongoDB-sse salvestatud flights:', JSON.stringify(savedReservation.flights, null, 2));
        
        res.status(201).json(savedReservation);
    } catch (error) {
        console.error('Viga broneeringu salvestamisel:', error);
        res.status(500).json({ error: error.message });
    }
});

// Reservatsioonide saamine hinnakirja ID järgi
router.get('/api/reservations/:priceListId', async (req, res) => {
    try {
        // Kontrollib, kas priceList on viimase 15 hulgas
        const latestPriceLists = await PriceList.find()
            .sort({ validUntil: -1 })
            .limit(15);

        const isPriceListValid = latestPriceLists.some(pl => 
            pl.id === req.params.priceListId
        );

        if (!isPriceListValid) {
            return res.status(404).json({ 
                message: "Reservatsioone ei saa kuvada, kuna hinnakiri pole enam viimase 15 hulgas" 
            });
        }

        const reservations = await reservationService.getReservationsByPriceListId(req.params.priceListId);
        
        if (!reservations.length) {
            return res.status(404).json({ message: "Reservatsioone ei leitud" });
        }
        
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lisa uus endpoint kõikide broneeringute saamiseks
router.get('/reservations', async (req, res) => {
    try {
        console.log('=== GET /reservations ===');
        const reservations = await Reservation.find().lean();
        console.log('MongoDB päring tagastas:', JSON.stringify(reservations, null, 2));
        
        res.json(reservations);
    } catch (error) {
        console.error('VIGA broneeringute pärimisel:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 