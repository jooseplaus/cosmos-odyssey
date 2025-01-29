import client from './client';
import axios from 'axios';

// API funktsioonid hinnakirjade ja broneeringute haldamiseks
export const priceListApi = {
    // Saab praeguse kehtiva priceListi
    getCurrentPriceList: () => client.get('/prices'),
    
    // Saab kõik aktiivsed priceListid (viimased 15)
    getAllPriceLists: () => client.get('/prices/all'),
    
    // Leiab teed planeetide vahel
    findRoutes: (data) => {
        console.log('API call data:', data);
        return client.post('/find-routes', data);
    },
    
    // Loo uus reservatsioon
    createReservation: (reservationData) => {
        console.log('Saadan broneeringu:', reservationData);
        return client.post('/reservations', reservationData);
    },
    
    // Saab reservatsioone
    getReservations: () => {
        return client.get('/reservations');
    },

    getPriceList: () => {
        return client.get('/price-list');
    }
}; 