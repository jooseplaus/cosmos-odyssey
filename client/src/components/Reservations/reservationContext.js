import React, { createContext, useContext, useState } from 'react';
import { createReservation, getReservations } from './reservationService';

const ReservationContext = createContext();
// Hook, mis tagastab reservatsiooni konteksti
export const useReservation = () => useContext(ReservationContext);

// Reservatsiooni konteksti provider
export const ReservationProvider = ({ children }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const makeReservation = async (reservationData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await createReservation(reservationData);
            setReservations(prev => [...prev, response]);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Reservatsioonide saamine
    const fetchReservations = async (priceListId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getReservations(priceListId);
            setReservations(response);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <ReservationContext.Provider value={{
            reservations,
            loading,
            error,
            makeReservation,
            fetchReservations
        }}>
            {children}
        </ReservationContext.Provider>
    );
};
