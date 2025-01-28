const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cosmos-odyssey', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB ühendatud:', conn.connection.host);
    } catch (error) {
        console.error('MongoDB ühenduse viga:', error);
        process.exit(1);
    }
};

module.exports = connectDB; 