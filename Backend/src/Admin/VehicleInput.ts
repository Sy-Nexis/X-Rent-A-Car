import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// Endpoint will be: POST http://localhost:5000/api/vehicles/add
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { make, model, year, vin, licensePlate, transmission, fuelType, engineCapacity, color, mileage, dailyRate, branch, status } = req.body;
        // Secure SQL --> ? -- SQL INJECTION Can't
        const insertQuery = `INSERT INTO vehicles ( make, model, year, vin, license_plate, transmission, fuel_type, engine_capacity, color, mileage, daily_rate, branch, status ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(insertQuery, [make, model, year, vin, licensePlate, transmission, fuelType, engineCapacity, color, mileage, dailyRate, branch, status]);



        res.status(201).json({
            success: true,
            message: 'Vehicle successfully registered to the fleet.',
            data: result
        });

    } catch (error: any) {
        console.error('Error inserting vehicle:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while saving vehicle data.'
        });
    }
});

export default router;