import React, { useState } from 'react';
import { useReservation } from './reservationContext';
import styled from 'styled-components';
import { priceListApi } from '../../api/priceListApi';

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const PopupForm = styled.div`
    background: white;
    padding: 30px;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    position: relative;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const CloseButton = styled.button`
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    
    &:hover {
        color: #333;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const FlightInfo = styled.div`
    margin-bottom: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;

    h3 {
        margin: 0 0 10px 0;
        color: #333;
    }

    p {
        margin: 5px 0;
        color: #666;
    }
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
`;

const SubmitButton = styled.button`
    padding: 12px;
    background: #0052cc;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;

    &:hover {
        background: #0747a6;
    }

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

const SuccessMessage = styled.div`
    background: #36B37E;
    color: white;
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 15px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
`;

const ErrorMessage = styled.div`
    background: #FF5630;
    color: white;
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 15px;
    text-align: center;
`;

// Funktsioon, mis formatib lennu kestvuse
const formatDuration = (duration) => {
    const parts = [];
    if (duration.days > 0) parts.push(`${duration.days} days`);
    if (duration.hours > 0) parts.push(`${duration.hours} hours`);
    if (duration.minutes > 0) parts.push(`${duration.minutes} minutes`);
    return parts.join(' ');
};

// Funktsioon, mis formatib kuupäeva
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Komponent, mis kuvab reservatsiooni vormi
const ReservationForm = ({ selectedRoute, onClose }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: ''
    });
    const [success, setSuccess] = useState(false);
    const { makeReservation, loading, error } = useReservation();

    // Funktsioon, mis käivitub, kui reservatsiooni vormi saadetakse
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Selected route flights:', selectedRoute.flights);

            const reservationData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                routes: selectedRoute.route,
                totalPrice: parseFloat(selectedRoute.totalPrice),
                totalDuration: {
                    days: selectedRoute.totalDuration.days || 0,
                    hours: selectedRoute.totalDuration.hours || 0,
                    minutes: selectedRoute.totalDuration.minutes || 0
                },
                companies: [selectedRoute.company],
                flights: selectedRoute.flights.map(flight => ({
                    flightNumber: `${flight.from}-${flight.to}`,
                    from: flight.from,
                    to: flight.to,
                    company: flight.company,
                    startTime: flight.flightStart,
                    endTime: flight.flightEnd,
                    distance: flight.distance,
                    price: flight.price
                }))
            };
            
            console.log('Saadan broneeringu:', reservationData);
            const response = await priceListApi.createReservation(reservationData);
            
            if (response.status === 201) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (err) {
            console.error('Viga broneeringu tegemisel:', err);
        }
    };

    // Funktsioon, mis käivitub, kui vormi väli muudetakse
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <Overlay onClick={onClose}>
            <PopupForm onClick={e => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                
                {success ? (
                    <SuccessMessage>
                        <span>✓</span>
                        Booking successful!
                    </SuccessMessage>
                ) : (
                    <>
                        <FlightInfo>
                            <h3>Flight details</h3>
                            <p>Route: {selectedRoute.route}</p>
                            <p>Company: {selectedRoute.company}</p>
                            <p>Total price: {selectedRoute.totalPrice.toFixed(2)} €</p>
                            <p>Flight duration: {formatDuration(selectedRoute.totalDuration)}</p>
                            <p>Departure: {formatDate(selectedRoute.flights[0].flightStart)}</p>
                            <p>Arrival: {formatDate(selectedRoute.flights[selectedRoute.flights.length - 1].flightEnd)}</p>
                        </FlightInfo>

                        <Form onSubmit={handleSubmit}>
                            <Input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                required
                            />
                            <Input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                required
                            />
                            <SubmitButton type="submit" disabled={loading}>
                                {loading ? 'Booking...' : 'Confirm Booking'}
                            </SubmitButton>
                            {error && <ErrorMessage>{error}</ErrorMessage>}
                        </Form>
                    </>
                )}
            </PopupForm>
        </Overlay>
    );
};

export default ReservationForm;
