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
import { protect } from './middleware/authMiddleware';

import { supabase } from './db';
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors()); // Allow cross-origin requests from your frontend
app.use(express.json()); // Parse incoming JSON payloads



app.use('/api/auth', authRoutes);


app.use('/api/vehicles/', vehicleInputRouter);
app.use('/api/vehicles/view', vehicleViwRouter);
app.use('/api/vehicles/del', vehicleDeleteRouter);

app.use('/api/clients/', clientInputRouter);
app.use('/api/clients/view', clientViwRouter);
app.use('/api/clients/del', clientDeleteRouter);

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
        const { error } = await supabase.from('staff').select('id').limit(1);

        if (error) {
            console.error('Supabase connection failed. Check your .env keys:', error.message);
        } else {
            console.log('Supabase DB connected successfully');
        }
    } catch (error) {
        console.error('Unexpected Supabase connection error:', error);
    }
});