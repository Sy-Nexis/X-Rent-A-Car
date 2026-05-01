// src/index.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vehicleInputRouter from './Admin/VehicleInput';
import vehicleViwRouter from './Admin/VehicleView';
import vehicleDeleteRouter from './Admin/VehicleDelete';
import pool from './db';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests from your frontend
app.use(express.json()); // Parse incoming JSON payloads






app.use('/api/vehicles/add', vehicleInputRouter);
app.use('/api/vehicles/update', vehicleInputRouter);
app.use('/api/vehicles/view', vehicleViwRouter);
app.use('/api/vehicles/del', vehicleDeleteRouter);

// Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'Active',
        message: 'XNRENT Fleet API is running.'
    });
});

// Start the Server
app.listen(PORT, async () => {
    console.log(`API Server running on http://localhost:${PORT}`);

    try {
        const connection = await pool.getConnection();
        console.log('DB successfully');
        connection.release();
    } catch (error) {
        console.error('DB failed:', error);
    }
});