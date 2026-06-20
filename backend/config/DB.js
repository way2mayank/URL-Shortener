const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener');
        console.log('Connected to database');
    } catch (err) {
        console.error('DB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;