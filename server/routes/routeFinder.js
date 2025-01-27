const express = require('express');
const router = express.Router();
const PriceList = require('../models/PriceList');
const { calculateItineraryDetails } = require('./itinerary');

const findAllRoutes = (legs, start, end) => {
    // Ehita graaf API andmetest
    const graph = {};
    
    // Koosta graaf kõigist API poolt pakutud ühendustest
    legs.forEach(leg => {
        const from = leg.routeInfo.from.name;
        const to = leg.routeInfo.to.name;
        
        // Lisa mõlemas suunas, sest lennud käivad mõlemat pidi
        if (!graph[from]) graph[from] = new Set();
        if (!graph[to]) graph[to] = new Set();
        
        graph[from].add(to);
        graph[to].add(from);
    });

    console.log('Generated graph:', graph); // Debug: näeme, millised ühendused leiti

    const allRoutes = [];
    const visited = new Set();

    const findPaths = (current, path = [], visitedLegs = []) => {
        // Kui jõudsime sihtpunkti
        if (current === end) {
            allRoutes.push({
                planets: [...path, current],
                legs: [...visitedLegs]
            });
            return;
        }

        visited.add(current);

        // Vaata kõiki võimalikke järgmisi sihtkohti
        const possibleDestinations = Array.from(graph[current] || []);
        
        for (const nextPlanet of possibleDestinations) {
            if (!visited.has(nextPlanet)) {
                // Leia vastav "leg" API andmetest
                const leg = legs.find(l => 
                    (l.routeInfo.from.name === current && l.routeInfo.to.name === nextPlanet) ||
                    (l.routeInfo.from.name === nextPlanet && l.routeInfo.to.name === current)
                );

                if (leg) {
                    path.push(current);
                    visitedLegs.push({
                        legId: leg.id,
                        from: current,
                        to: nextPlanet,
                        distance: leg.routeInfo.distance
                    });
                    findPaths(nextPlanet, path, visitedLegs);
                    path.pop();
                    visitedLegs.pop();
                }
            }
        }

        visited.delete(current);
    };

    findPaths(start);
    console.log('Found routes:', allRoutes); // Debug: näeme leitud teekondi
    return allRoutes;
};

// Abifunktsioon marsruutide leidmiseks
const findRoutes = async (priceListId, startLocation, endLocation) => {
    const priceList = await PriceList.findOne({ id: priceListId });
    if (!priceList) throw new Error('Price list not found');

    // Koosta graaf
    const routes = priceList.legs.map(leg => ({
        from: leg.routeInfo.from.name,
        to: leg.routeInfo.to.name,
        distance: leg.routeInfo.distance,
        providers: leg.providers,
        id: leg.id
    }));

    return findAllRoutes(routes, startLocation, endLocation);
};

// Abifunktsioonid
const calculateDuration = (route) => {
    const start = new Date(route.providers[0].flightStart);
    const end = new Date(route.providers[route.providers.length - 1].flightEnd);
    return (end - start) / (1000 * 60); // minutites
};

const calculatePrice = (route) => {
    return route.providers.reduce((sum, provider) => sum + provider.price, 0);
};

router.post('/find-routes', async (req, res) => {
    try {
        const { priceListId, startLocation, endLocation } = req.body;
        console.log('Otsime teed:', startLocation, '->', endLocation);
        
        const priceList = await PriceList.findOne({ id: priceListId });
        if (!priceList) {
            throw new Error('Price list not found');
        }

        // Leia kõik võimalikud marsruudid
        const allRoutes = findAllRoutes(priceList.legs, startLocation, endLocation);
        console.log('Leitud marsruudid:', allRoutes);

        // Saada marsruudid itinerary.js-ile töötlemiseks
        const flightPlans = await calculateItineraryDetails(priceList.legs, allRoutes);
        
        res.json(flightPlans);
    } catch (error) {
        console.error('Error finding routes:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 