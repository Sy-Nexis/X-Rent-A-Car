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
import authRoutes from './routes/authRoutes';
import { supabase } from './config/supabase';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8801;

// Global Middleware
app.use(cors()); // Allow cross-origin requests from the Frontend
app.use(express.json()); // Parse incoming JSON payloads

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Mounting Routing Layers
app.use('/api/auth', authRoutes);

// Admin Routes (Vehicles & Clients)
app.use('/api/vehicles', vehicleInputRouter);
app.use('/api/vehicles/view', vehicleViwRouter);
app.use('/api/vehicles/del', vehicleDeleteRouter);

app.use('/api/clients', clientInputRouter);
app.use('/api/clients/view', clientViwRouter);
app.use('/api/clients/del', clientDeleteRouter);

// Health system monitoring endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: "Active" });
});

// Initialize and Start Server
app.listen(PORT, async () => {
    console.log(`API Server running on http://localhost:${PORT}`);

    try {
        // Execute a single lightweight metadata query mock to Supabase to verify table accessibility on startup
        const { error } = await supabase.from('staff').select('id').limit(1);

        if (error) {
            console.error('Supabase connection verification failed. Check environment variables:', error.message);
        } else {
            console.log('CONNECTION STATUS: Supabase DB connected successfully. Metadata query execution passed.');
        }
    } catch (error) {
        console.error('Unexpected Supabase connection error on startup validation:', error);
    }
});