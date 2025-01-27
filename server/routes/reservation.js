const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const PriceList = require('../models/PriceList');
const validateReservation = require('../middleware/validateReservation');

// Reservatsiooni loomine
router.post('/api/reservations', validateReservation, async (req, res) => {
    try {
        // Kontrolli, kas seotud priceList on viimase 15 hulgas
        const reservation = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            routes: req.body.routes,
            totalPrice: req.body.totalPrice,
            totalDuration: req.body.totalDuration,
            companies: req.body.companies,
            priceListId: req.body.priceListId,
            createdAt: new Date()
        };
        
        const savedReservation = await Reservation.create(reservation);
        res.status(201).json(savedReservation);
    } catch (error) {
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

        const reservations = await Reservation.find({ 
            priceListId: req.params.priceListId 
        });
        
        if (!reservations.length) {
            return res.status(404).json({ message: "Reservatsioone ei leitud" });
        }
        
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 