const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

let client;
let db;

async function connectDB() {
  if (db) return db; // ✅ reuse connection

  client = new MongoClient(uri);
  await client.connect();

  db = client.db(); // default DB from URI
  console.log("MongoDB connected");

  return db;
}

module.exports = { connectDB };
