const express = require('express');
const router = express.Router();

const calculateItineraryDetails = (legs, routes) => {
    if (!legs || !routes) {
        console.error('Missing legs or routes data');
        return [];
    }

    console.log('Processing routes:', routes.map(r => r.planets.join(' → ')));
    const flightPlans = [];

    routes.forEach(route => {
        // Leia kõik lennufirmad
        const companies = new Set();
        route.legs.forEach(leg => {
            const fullLeg = legs.find(l => l.id === leg.legId);
            if (!fullLeg) {
                console.error('Could not find leg with id:', leg.legId);
                return;
            }
            if (!fullLeg.routeInfo) {
                console.error('Missing routeInfo for leg:', leg.legId);
                return;
            }
            fullLeg.providers.forEach(p => {
                if (p.company && p.company.name) {
                    companies.add(p.company.name);
                }
            });
        });

        companies.forEach(company => {
            let validPlan = {
                company,
                planets: route.planets,
                flights: [],
                totalPrice: 0,
                totalDistance: 0,
                totalDuration: 0,
                route: route.planets.join(' → ')
            };

            let lastFlightEnd = null;
            let isValidPlan = true;

            // Proovib leida sobivad lennud igale etapile
            for (const leg of route.legs) {
                const fullLeg = legs.find(l => l.id === leg.legId);
                if (!fullLeg || !fullLeg.routeInfo) {
                    isValidPlan = false;
                    break;
                }

                const providerFlights = fullLeg.providers.filter(p => 
                    p.company.name === company &&
                    (!lastFlightEnd || new Date(p.flightStart) >= lastFlightEnd)
                );

                if (providerFlights.length === 0) {
                    isValidPlan = false;
                    break;
                }

                // Võtab sobivatest lendudest odavaim
                const bestFlight = providerFlights.reduce((best, current) => 
                    current.price < best.price ? current : best
                );

                validPlan.flights.push({
                    from: fullLeg.routeInfo.from.name,
                    to: fullLeg.routeInfo.to.name,
                    flightStart: bestFlight.flightStart,
                    flightEnd: bestFlight.flightEnd,
                    price: bestFlight.price,
                    distance: fullLeg.routeInfo.distance,
                    provider: {
                        name: bestFlight.company.name,
                        flightNumber: bestFlight.id,
                        companyId: bestFlight.company.id
                    }
                });

                lastFlightEnd = new Date(bestFlight.flightEnd);
                validPlan.totalPrice += bestFlight.price;

                // Liida distants juurde ainult kui see on olemas
                if (fullLeg.routeInfo.distance) {
                    validPlan.totalDistance += fullLeg.routeInfo.distance;
                }
            }

            if (isValidPlan) {
                const isComplete = validPlan.flights.every(f => 
                    f.from && f.to && f.flightStart && f.flightEnd && 
                    f.price && f.distance && f.provider && f.provider.name
                );
                
                if (isComplete) {
                    const totalMinutes = (new Date(validPlan.flights[validPlan.flights.length-1].flightEnd) - 
                                        new Date(validPlan.flights[0].flightStart)) / (1000 * 60);
                    
                    validPlan.totalDuration = {
                        days: Math.floor(totalMinutes / (24 * 60)),
                        hours: Math.floor((totalMinutes % (24 * 60)) / 60),
                        minutes: Math.floor(totalMinutes % 60)
                    };
                    
                    // Lisa kontroll, et kõik vajalikud distantsid on olemas
                    const allDistancesValid = validPlan.flights.every(flight => 
                        typeof flight.distance === 'number' && flight.distance > 0
                    );

                    if (allDistancesValid) {
                        flightPlans.push(validPlan);
                    } else {
                        console.error('Invalid distances in plan:', validPlan);
                    }
                } else {
                    console.error('Invalid plan data:', JSON.stringify(validPlan, null, 2));
                }
            }
        });
    });

    if (flightPlans.length === 0) {
        console.log('No valid flight plans found');
    } else {
        console.log(`Found ${flightPlans.length} valid flight plans`);
    }

    return flightPlans;
};

router.post('/api/calculate-routes', async (req, res) => {
    console.log('Request body:', req.body); // Lisa see
    const { priceList, routes } = req.body;
    
    try {
        if (!priceList || !priceList.legs || !routes) {
            throw new Error('Missing required data: priceList or routes');
        }

        console.log('Found routes before calculation:', routes); // Lisa see
        const possibleRoutes = calculateItineraryDetails(priceList.legs, routes);
        console.log('Calculated routes:', possibleRoutes); // Lisa see
        res.json(possibleRoutes);
    } catch (error) {
        console.error('Error in calculate-routes:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    router,
    calculateItineraryDetails
}; 