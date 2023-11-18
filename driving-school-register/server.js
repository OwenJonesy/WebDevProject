const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { connectToDatabase, closeDatabaseConnection } = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/register', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Invalid request. Request body is empty.' });
        }

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required for registration.' });
        }

        const db = await connectToDatabase();
        const studentsCollection = db.collection('students');

        // Check if the email already exists
        const existingUser = await studentsCollection.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists. Please use a different email.' });
        }

        const result = await studentsCollection.insertOne(req.body);

        if (result.insertedCount === 1) {
            return res.status(201).json({ message: 'Registration successful', data: result.ops[0] });
        } else {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        closeDatabaseConnection();
    }
});

app.post('/login', async (req, res) => {
    try {
        const { loginEmail, loginPassword } = req.body;

        if (!loginEmail || !loginPassword) {
            return res.status(400).json({ error: 'Email and password are required for login.' });
        }

        const db = await connectToDatabase();
        const studentsCollection = db.collection('students');

        // Check if the user with the given email and password exists
        const user = await studentsCollection.findOne({ email: loginEmail, password: loginPassword });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Login successful
        return res.status(200).json({ message: 'Login successful', data: user });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        closeDatabaseConnection();
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
