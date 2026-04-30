// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db'; // Imports your database connection

// Load environment variables
dotenv.config();

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


app.listen(PORT, () => {
    console.log(`Server -> http://localhost:${PORT}`);
});