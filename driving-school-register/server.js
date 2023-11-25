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
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/update-password', async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Email, old password, and new password are required for password update.' });
        }

        const db = await connectToDatabase();
        const studentsCollection = db.collection('students');

        const user = await studentsCollection.findOne({ email, password: oldPassword });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or old password for password update.' });
        }

        const updateResult = await studentsCollection.updateOne({ email }, { $set: { password: newPassword } });

        if (updateResult.modifiedCount === 1) {
            return res.status(200).json({ message: 'Password update successful' });
        } else {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Error during password update:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        closeDatabaseConnection();
    }
});

app.post('/delete-account', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required for account deletion.' });
        }

        const db = await connectToDatabase();
        const studentsCollection = db.collection('students');

        const user = await studentsCollection.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password for account deletion.' });
        }

        const deletionResult = await studentsCollection.deleteOne({ email, password });

        if (deletionResult.deletedCount === 1) {
            return res.status(200).json({ message: 'Account deletion successful' });
        } else {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Error during account deletion:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        closeDatabaseConnection();
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
