// src/index.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vehicleInputRouter from './Admin/VehicleInput';
import vehicleViwRouter from './Admin/VehicleView';
import vehicleDeleteRouter from './Admin/VehicleDelete';
import clientInputRouter from './Admin/ClientInput';
import clientViwRouter from './Admin/ClientView';
import clientDeleteRouter from './Admin/ClientDelete';
import pool from './db';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests from your frontend
app.use(express.json()); // Parse incoming JSON payloads






app.use('/api/vehicles/', vehicleInputRouter);
app.use('/api/vehicles/view', vehicleViwRouter);
app.use('/api/vehicles/del', vehicleDeleteRouter);

app.use('/api/clients/', clientInputRouter);
app.use('/api/clients/view', clientViwRouter);
app.use('/api/clients/del', clientDeleteRouter);

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