import React, { useState } from 'react';
import usePricelist from './functions/pricelist/usePriceList'; // Kasutab sinu olemasolevat hooki
import calculateItineraryDetails from './functions/routes/itineraryDetails';

const RouteFinderTester = () => {
    const { routes, locations, loading, error } = usePricelist(); // Laeb marsruudid ja seotud andmed
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [foundRoutes, setFoundRoutes] = useState([]);

    const findAllRoutes = (routes, start, end, path = []) => {
        path.push(start);

        if (start === end) {
            return [path];
        }

        let results = [];
        const connections = routes
            .filter((route) => route.from.name === start)
            .map((route) => route.to.name);

        for (const connection of connections) {
            if (!path.includes(connection)) {
                const newRoutes = findAllRoutes(routes, connection, end, [...path]);
                results = results.concat(newRoutes);
            }
        }

        return results;
    };

    const handleFindRoutes = () => {
        if (routes.length === 0) {
            alert('Marsruudid pole veel laaditud!');
            return;
        }
        if (!startLocation || !endLocation) {
            alert('Palun vali algus- ja sihtkoht!');
            return;
        }

        const results = findAllRoutes(routes, startLocation, endLocation);
        setFoundRoutes(results);
    };

    if (loading) return <div>Laadimine...</div>;
    if (error) return <div>Viga: {error}</div>;

    return (
        <div>
            <h1>Route Finder Tester</h1>
            <div>
                <label>
                    Alguskoht:
                    <select
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                    >
                        <option value="" disabled>
                            Vali alguskoht
                        </option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.name}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Sihtkoht:
                    <select
                        value={endLocation}
                        onChange={(e) => setEndLocation(e.target.value)}
                    >
                        <option value="" disabled>
                            Vali sihtkoht
                        </option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.name}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <button onClick={handleFindRoutes}>Leia teekonnad</button>
            <div>
                <h2>Leitud teekonnad:</h2>
                {foundRoutes.length > 0 ? (
                    foundRoutes.map((route, index) => {
                        const routeOptions = calculateItineraryDetails(routes, route);
                        
                        return (
                            <div key={index}>
                                <h3>Marsruut: {route.join(' -> ')}</h3>
                                {routeOptions.map((option, optionIndex) => (
                                    <div key={optionIndex} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                                        <h4>Lennufirma: {option.flightDetails[0].provider}</h4>
                                        <p>Variant {optionIndex + 1}:</p>
                                        <p>Koguhind: €{option.totalPrice.toFixed(2)}</p>
                                        <p>Kogudistants: {option.totalDistance} km</p>
                                        <p>Kogukestvus: {option.totalDuration} minutit</p>
                                        <ul>
                                            {option.flightDetails.map((flight, idx) => (
                                                <li key={idx}>
                                                    {flight.from} -> {flight.to}: {flight.provider}, 
                                                    Algus: {new Date(flight.start).toLocaleString()},
                                                    Lõpp: {new Date(flight.end).toLocaleString()},
                                                    Hind: {flight.price}€
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        );
                    })
                ) : (
                    <p>Teekondi ei leitud!</p>
                )}
            </div>
        </div>
    );
};

export default RouteFinderTester;
