// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db'; // Imports your database connection

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Frontend - Backend Communication
app.use(express.json()); // Allows the backend to understand JSON data

// TESTING
// app.get('/api/health', (req, res) => {
//     res.json({ status: 'OK', message: 'XNRENT Backend is running smoothly!' });
// });

// DB Check
app.get('/api/db-check', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        res.json({ status: 'Connected', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'Database Error', error });
    }
});
// Get all vehicles
app.get('/api/vehicles', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch vehicles' });
    }
});

// Add new vehicle
app.post('/api/vehicles', async (req, res) => {
    try {
        const { make, model, licensePlate, year, mileage, fuelType, transmission } = req.body;
        await pool.execute(
            'INSERT INTO vehicles (make, model, license_plate, year, mileage, fuel_type, transmission, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [make, model, licensePlate, year, mileage, fuelType, transmission, 'Active']
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to add vehicle' });
    }
});

app.listen(PORT, () => {
    console.log(`Server -> http://localhost:${PORT}`);
});