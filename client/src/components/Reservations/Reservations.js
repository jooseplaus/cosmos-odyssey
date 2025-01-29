import React, { useState, useEffect } from 'react';
import { priceListApi } from '../../api/priceListApi';
import styled from 'styled-components';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedReservations, setExpandedReservations] = useState({});

    // Abifunktsioon kestuse vormindamiseks
    const formatDuration = (duration) => {
        if (!duration) return 'Teadmata';
        const { days, hours, minutes } = duration;
        return `${days || 0} päeva, ${hours || 0} tundi, ${minutes || 0} minutit`;
    };

    // Uuendatud kuupäeva formaat
    const formatDate = (dateString) => {
        if (!dateString) return 'Kuupäev puudub';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Kui kuupäev on vigane, tagasta originaal string või teade
            return dateString || 'Kuupäev puudub';
        }
        return date.toLocaleString('et-EE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleConnectingFlights = (reservationId) => {
        setExpandedReservations(prev => ({
            ...prev,
            [reservationId]: !prev[reservationId]
        }));
    };

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await priceListApi.getReservations();
                console.log('Broneeringute vastus:', response);
                setReservations(response.data || []);
                setLoading(false);
            } catch (err) {
                console.error('Viga broneeringute laadimisel:', err);
                setError('Broneeringute laadimine ebaõnnestus');
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (reservations.length === 0) return <div>No bookings yet</div>;

    return (
        <ReservationsContainer>
            <h2>Bookings</h2>
            {reservations.map((reservation) => (
                <ReservationCard key={reservation._id}>
                    <h3>{reservation.firstName} {reservation.lastName}</h3>
                    <p>Total price: {reservation.totalPrice.toFixed(2)} €</p>
                    <p>Trip duration: {formatDuration(reservation.totalDuration)}</p>
                    <RouteDetails>
                        <p>Route: {reservation.routes}</p>
                        <p>Company: {Array.isArray(reservation.companies) ? 
                            reservation.companies.join(', ') : 
                            reservation.companies}</p>
                        
                        <ShowConnectingFlightsButton 
                            onClick={() => toggleConnectingFlights(reservation._id)}
                        >
                            {expandedReservations[reservation._id] 
                                ? "Hide connecting flights" 
                                : "Show connecting flights"}
                        </ShowConnectingFlightsButton>

                        <ConnectingFlights 
                            showConnectingFlights={expandedReservations[reservation._id]}
                        >
                            <h4>Connecting flights:</h4>
                            {reservation.flights && reservation.flights.map((flight, index) => (
                                <FlightCard key={index}>
                                    <h5>Flight {index + 1}: {flight.from} → {flight.to}</h5>
                                    <FlightDetails>
                                        <p>Company: {flight.company}</p>
                                        <p>Departure: {formatDate(flight.startTime)}</p>
                                        <p>Arrival: {formatDate(flight.endTime)}</p>
                                        <p>Distance: {(flight.distance / 1000000).toFixed(1)} million km</p>
                                        <p>Price: {flight.price.toFixed(2)} €</p>
                                    </FlightDetails>
                                </FlightCard>
                            ))}
                        </ConnectingFlights>
                    </RouteDetails>
                </ReservationCard>
            ))}
        </ReservationsContainer>
    );
};

const ReservationsContainer = styled.div`
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
`;

const ReservationCard = styled.div`
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
    width: 100%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const RouteDetails = styled.div`
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #eee;
`;

const ConnectingFlights = styled.div`
    margin-top: 15px;
    display: ${props => props.showConnectingFlights ? 'block' : 'none'};
`;

const FlightCard = styled.div`
    background: #f8f9fa;
    border-radius: 4px;
    padding: 15px;
    margin: 10px 0;
`;

const FlightDetails = styled.div`
    margin-left: 15px;
    font-size: 0.9em;
    
    p {
        margin: 5px 0;
    }
`;

const ShowConnectingFlightsButton = styled.button`
    margin-top: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
`;

export default Reservations;