const request = require('supertest');
const app = require('../server');

describe('Reservation API', () => {
    let priceListId;

    beforeAll(async () => {
        // Get a valid pricelist ID first
        const response = await request(app).get('/api/prices');
        priceListId = response.body.id;
    });

    test('POST /api/reservations should create new reservation', async () => {
        const testReservation = {
            firstName: 'John',
            lastName: 'Doe',
            priceListId,
            routes: [{
                from: 'Mercury',
                to: 'Venus',
                company: 'SpaceX',
                price: 1000,
                flightStart: '2024-03-20T10:00:00Z',
                flightEnd: '2024-03-20T12:00:00Z'
            }],
            totalPrice: 1000,
            totalTravelTime: 120,
            companies: ['SpaceX']
        };

        const response = await request(app)
            .post('/api/reservations')
            .send(testReservation);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
    });

    test('GET /api/reservations/:priceListId should return reservations', async () => {
        const response = await request(app)
            .get(`/api/reservations/${priceListId}`);
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
}); 