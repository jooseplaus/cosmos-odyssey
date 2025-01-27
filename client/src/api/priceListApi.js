import client from './client';


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
    createReservation: (data) => client.post('/reservations', data),
    
    // Saab reservatsioone priceListi põhjal
    getReservations: (priceListId) => client.get(`/reservations/${priceListId}`)
}; 