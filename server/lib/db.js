// server/lib/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // PASTE YOUR CLOUD URL HERE (Replace <password> with your real password)
        const MONGO_URI = "mongodb+srv://kundankumar09187:lawyer123@cluster0.b24gn1z.mongodb.net/?appName=Cluster0";

        const conn = await mongoose.connect(MONGO_URI);
        console.log(`✅ Cloud MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;