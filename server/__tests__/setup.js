const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');

let mongoServer;
let server;

beforeAll(async () => {
    // Käivita MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Ühendu andmebaasiga
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Käivita server
    return new Promise((resolve) => {
        server = app.listen(0, () => resolve());
    });
});

afterAll(async () => {
    // Sulge server
    await new Promise((resolve) => server.close(resolve));
    
    // Sulge andmebaasi ühendus
    await mongoose.disconnect();
    await mongoServer.stop();
    
    // Puhasta intervalid
    app.cleanup();
});

// Ekspordi server testide jaoks
global.__SERVER__ = server;

describe('Database setup', () => {
    test('should connect to database', () => {
        expect(mongoose.connection.readyState).toBe(1);
    });
}); 