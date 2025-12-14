// server/lib/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // PASTE YOUR CLOUD URL HERE (Replace <password> with your real password)
        const MONGO_URI = process.env.MONGO_URI;

        const conn = await mongoose.connect(MONGO_URI);
        console.log(`✅ Cloud MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;