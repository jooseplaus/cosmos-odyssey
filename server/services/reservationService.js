const Reservation = require('../models/Reservation');

module.exports = {
    // Loo uus broneering
    createReservation: async (reservationData) => {
        try {
            console.log('Broneeringu andmed:', JSON.stringify(reservationData, null, 2));
            const reservation = new Reservation({
                firstName: reservationData.firstName,
                lastName: reservationData.lastName,
                routes: reservationData.routes,
                totalPrice: reservationData.totalPrice,
                totalDuration: reservationData.totalDuration,
                companies: reservationData.companies,
                bookingDate: new Date()
            });
            
            console.log('Loodud reservation objekt:', JSON.stringify(reservation, null, 2));
            const savedReservation = await reservation.save();
            console.log('Salvestatud reservation:', JSON.stringify(savedReservation, null, 2));
            return savedReservation;
        } catch (error) {
            console.error('Viga broneeringu salvestamisel:', error);
            throw error;
        }
    },

    // Saa kõik broneeringud
    getAllReservations: async () => {
        try {
            const reservations = await Reservation.find()
                .sort({ bookingDate: -1 });
            console.log('Leitud broneeringud:', reservations);
            return reservations;
        } catch (error) {
            console.error('Viga broneeringute leidmisel:', error);
            throw error;
        }
    }
};