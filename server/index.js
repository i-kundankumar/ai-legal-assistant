require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./lib/db'); // Import Connection

const documentRoutes = require('./routes/documents');
const escalationRoutes = require('./routes/escalations');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/documents', documentRoutes);
app.use('/api/escalations', escalationRoutes);

app.get('/', (req, res) => res.send('Agentic AI Backend (MongoDB Version) Running'));

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
});