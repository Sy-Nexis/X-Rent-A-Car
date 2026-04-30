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
app.use(cors()); // Allows your Next.js frontend to communicate with this backend
app.use(express.json()); // Allows the backend to understand JSON data

// A simple test route to make sure it's working
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'XNRENT Backend is running smoothly!' });
});

// A test route to check database connection
app.get('/api/db-check', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        res.json({ status: 'Connected', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'Database Error', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});