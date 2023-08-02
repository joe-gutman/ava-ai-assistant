const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const name = process.env.MONGODB_DB;
const connectionString = process.env.MONGODB_URI;

const client = new MongoClient(connectionString);
let db;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db(name);
    return db;
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to be caught and handled elsewhere, if needed.
  }
};

module.exports = { connectDB };