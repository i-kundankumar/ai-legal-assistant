// server/lib/fileDB.js
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'local_data.json');

// Initialize file if missing
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ documents: [], escalations: [] }, null, 2));
}

// Read Data
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Write Data
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

module.exports = { readDB, writeDB };