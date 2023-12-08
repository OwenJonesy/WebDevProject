// server.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

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

app.use(async (req, res, next) => {
    try {
        database = await connectToDatabase();
        next();
    } catch (error) {
        console.error('Error connecting to MongoDB in middleware:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

app.post('/submit-booking', async (req, res) => {
    try {
        const { name, email, phone, lessonType, preferredTime } = req.body;

        if (!name || !email || !phone || !lessonType || !preferredTime) {
            return res.status(400).json({ error: 'All fields are required for booking.' });
        }

        console.log('Received Booking Data:', { name, email, phone, lessonType, preferredTime });

        const bookingsCollection = database.collection('bookings');

        const result = await bookingsCollection.insertOne({
            name,
            email,
            phone,
            lessonType,
            preferredTime,
        });

        if (result.insertedCount === 1) {
            return res.status(201).json({ message: 'Booking successful', data: result.ops[0] });
        }
    } catch (error) {
        console.error('Error during booking submission:', error);
        console.error(error.stack);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        closeDatabaseConnection();
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
