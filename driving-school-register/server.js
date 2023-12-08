//server.js

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

// Middleware to connect to the database before handling requests
app.use(async (req, res, next) => {
    try {
        database = await connectToDatabase();
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Routes for the different HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/bookings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bookings.html'));
});

app.get('/MyAccount', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'MyAccount.html'));
});

app.get('/Map', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Map.html'));
});




// Registration and login routes go here...




app.post('/register', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            // Check if the request body is empty
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
            // Email already exists, send an error response
            return res.status(409).json({ error: 'Email already exists. Please use a different email.' });
        }

        const result = await studentsCollection.insertOne(req.body);

        if (result.insertedCount === 1) {
            // Registration successful
            return res.status(201).json({ message: 'Registration successful', data: result.ops[0] });
        } else {
            // No documents were inserted
           // return res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        // Handle unexpected errors
        //return res.status(500).json({ error: 'Internal Server Error' });
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

// Add this route for changing passwords
app.post('/change-password', async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Email, old password, and new password are required for password change.' });
        }

        const db = await connectToDatabase();
        const studentsCollection = db.collection('students');

        // Check if the user with the given email and old password exists
        const user = await studentsCollection.findOne({ email, password: oldPassword });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or old password.' });
        }

        // Update the password
        const result = await studentsCollection.updateOne({ email }, { $set: { password: newPassword } });

        if (result.modifiedCount === 1) {
            // Password change successful
            return res.status(200).json({ message: 'Password change successful' });
        } else {
            // No documents were modified (email or password might not match)
            return res.status(401).json({ error: 'Invalid email or old password.' });
        }
    } catch (error) {
        console.error('Error during password change:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
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

// Add a new route to retrieve user details and bookings after login
app.get('/user-details/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const db = await connectToDatabase();
        const studentsCollection = db.collection('students');
        const bookingsCollection = db.collection('bookings');

        // Retrieve user details based on the provided email
        const user = await studentsCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Retrieve bookings based on the user's email
        const userBookings = await bookingsCollection.find({ email }).toArray();

        // Return user details and bookings
        return res.status(200).json({ data: { user, bookings: userBookings } });
    } catch (error) {
        console.error('Error retrieving user details and bookings:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        closeDatabaseConnection();
    }
});


// Add a new route to retrieve user details and bookings after login
/*app.get('/user-details/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const db = await connectToDatabase();
        const studentsCollection = db.collection('students');
        const bookingsCollection = db.collection('bookings');

        // Retrieve user details based on the provided email
        const user = await studentsCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Retrieve bookings based on the user's email
        const userBookings = await bookingsCollection.find({ email }).toArray();

        // Return user details and bookings
        return res.status(200).json({ data: { user, bookings: userBookings } });
    } catch (error) {
        console.error('Error retrieving user details and bookings:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        closeDatabaseConnection();
    }
});
*/


// Delete account route
app.delete('/delete-account', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required for account deletion.' });
        }

        const db = await connectToDatabase();
        const studentsCollection = db.collection('students');

        // Check if the user with the given email and password exists
        const user = await studentsCollection.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password for account deletion.' });
        }

        // Delete the user account
        const result = await studentsCollection.deleteOne({ email });

        if (result.deletedCount === 1) {
            // Account deletion successful
            return res.status(200).json({ message: 'Account deletion successful' });
        } else {
            // No documents were deleted
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Error during account deletion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        closeDatabaseConnection();
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

