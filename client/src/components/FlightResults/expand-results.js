import React from 'react';
import styled from 'styled-components';

// Komponent, mis kuvab vahelende 
const ExpandResults = ({ route }) => {
    if (!route) return null;

    // Formatib kuupäeva
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).replace(',', '');
        } catch (err) {
            console.error('Date formatting error:', err);
            return 'Invalid date';
        }
    };

    // Formatib kaugust 
    const formatDistance = (distance) => {
        if (!distance && distance !== 0) return 'Distance not available';
        
        if (distance >= 1000000) {
            return `${(distance / 1000000).toFixed(1)} million km`;
        } else if (distance >= 1000) {
            return `${(distance / 1000).toFixed(1)} thousand km`;
        } else {
            return `${distance.toFixed(1)} km`;
        }
    };

    return (
        <ExpandedContainer>
            <h4>Detailed Information:</h4>
            {route.flights.map((flight, index) => (
                <FlightDetails key={flight.provider.flightNumber}>
                    <h5>Flight: {index + 1}: {flight.from} → {flight.to}</h5>
                    <p>Company: {flight.provider.name}</p>
                    <p>Start: {formatDate(flight.flightStart)}</p>
                    <p>End: {formatDate(flight.flightEnd)}</p>
                    <p>Distance: {formatDistance(flight.distance)}</p>
                    <p>Price: {flight.price} €</p>
                </FlightDetails>
            ))}
        </ExpandedContainer>
    );
};

const ExpandedContainer = styled.div`
    width: 100%;
    margin: 0 auto;
`;

const FlightDetails = styled.div`
    margin: 1rem 0;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 4px;
`;

export default ExpandResults;