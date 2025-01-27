const express = require('express');
const router = express.Router();
const axios = require('axios');
const PriceList = require('../models/PriceList');

// Get current pricelist
router.get('/prices', async (req, res) => {
    try {
        const response = await axios.get('https://cosmosodyssey.azurewebsites.net/api/v1.0/TravelPrices');
        const apiData = response.data;

        // Salvestab andmebaasi
        await PriceList.create({
            id: apiData.id,
            validUntil: apiData.validUntil,
            legs: apiData.legs
        });
        await PriceList.keepLast15();

        // Tagastab andmed
        res.json(apiData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Saab kõik aktiivsed hinnakirjad
router.get('/prices/all', async (req, res) => {
    try {
        const pricelists = await PriceList.find()
            .sort({ validUntil: -1 })
            .limit(15);
        res.json(pricelists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 