const request = require('supertest');
const app = require('../server');
const PriceList = require('../models/PriceList');

describe('Price List API', () => {
    let server;

    beforeAll((done) => {
        server = app.listen(0, () => done());
    });

    afterAll((done) => {
        server.close(done);
    });

    test('GET /api/prices should fetch current pricelist', async () => {
        const response = await request(server)
            .get('/api/prices');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('locations');
        expect(response.body).toHaveProperty('routes');
    }, 30000);

    test('GET /api/prices/all should return last 15 pricelists', async () => {
        const response = await request(server)
            .get('/api/prices/all');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeLessThanOrEqual(15);
    }, 30000);
}); 