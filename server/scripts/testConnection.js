const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB ühendus õnnestus!');
        console.log('Ühendatud andmebaasiga:', mongoose.connection.name);
        await mongoose.disconnect();
    } catch (error) {
        console.error('MongoDB ühendus ebaõnnestus:', error.message);
    }
}

testConnection(); 