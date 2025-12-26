require("dotenv").config();

const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./lib/db'); // Import Connection
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');

dotenv.config();

const documentRoutes = require('./routes/documents');
const escalationRoutes = require('./routes/escalations');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(bodyParser.json());


// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/escalations', escalationRoutes);
app.use("/api/auth", authRoutes);




// Root Endpoint
app.get('/', (req, res) => res.send('Agentic AI Backend (MongoDB Version) Running'));

// 👇 CRITICAL FIX: Only listen if NOT in production (Vercel handles production listening automatically)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n🚀 Server running locally on http://localhost:${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;