const request = require('supertest');
const app = require('../server');

describe('Route Finder API', () => {
    test('POST /api/find-routes should find routes between planets', async () => {
        const testData = {
            routes: [
                {
                    from: { name: 'Mercury' },
                    to: { name: 'Venus' },
                    distance: 100,
                    providers: [
                        {
                            company: { name: 'SpaceX' },
                            price: 1000,
                            flightStart: '2024-03-20T10:00:00Z',
                            flightEnd: '2024-03-20T12:00:00Z'
                        }
                    ]
                }
            ],
            start: 'Mercury',
            end: 'Venus',
            sortBy: 'price'
        };

        const response = await request(app)
            .post('/api/find-routes')
            .send(testData);
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
}); 