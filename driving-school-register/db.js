// db.js

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/driving-school';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        database = client.db();
        return database;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

function closeDatabaseConnection() {
    client.close();
    console.log('Closed MongoDB connection');
}

module.exports = { connectToDatabase, closeDatabaseConnection, database };
