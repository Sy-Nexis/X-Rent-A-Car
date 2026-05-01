import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// /api/vehicles/add
router.post('/add', async (req: Request, res: Response): Promise<void> => {
    try {
        const { make, model, year, vin, license_plate, transmission, fuel_type, engine_capacity, color, mileage, daily_rate, branch, status } = req.body;
        // Secure SQL --> ? -- SQL INJECTION Can't
        const insertQuery = `INSERT INTO vehicles ( make, model, year, vin, license_plate, transmission, fuel_type, engine_capacity, color, mileage, daily_rate, branch, status ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(insertQuery, [make, model, year, vin, license_plate, transmission, fuel_type, engine_capacity, color, mileage, daily_rate, branch, status]);



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

router.put('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { vin } = req.query;

        if (!vin) {
            res.status(400).json({
                success: false,
                message: 'Please provide the vehicle VIN'
            });
            return;
        }

        const { make, model, year, licensePlate, transmission, fuelType, engineCapacity, color, mileage, dailyRate, branch, status } = req.body;


        //COALESCE(?, nameee) --> if NULL NO UPDATE
        const updateQuery = `
            UPDATE vehicles 
            SET  make = COALESCE(?, make), model = COALESCE(?, model), year = COALESCE(?, year), license_plate = COALESCE(?, license_plate), transmission = COALESCE(?, transmission), fuel_type = COALESCE(?, fuel_type), engine_capacity = COALESCE(?, engine_capacity), color = COALESCE(?, color), mileage = COALESCE(?, mileage), daily_rate = COALESCE(?, daily_rate), branch = COALESCE(?, branch), status = COALESCE(?, status)
            WHERE vin = ? `;

        const [result]: any = await pool.execute(updateQuery, [
            make ?? null,
            model ?? null,
            year ?? null,
            licensePlate ?? null,
            transmission ?? null,
            fuelType ?? null,
            engineCapacity ?? null,
            color ?? null,
            mileage ?? null,
            dailyRate ?? null,
            branch ?? null,
            status ?? null,
            String(vin)
        ]);

        if (result.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: 'No vehicle found matching that VIN.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Vehicle with VIN ${vin} has been successfully updated.`
        });

    } catch (error: any) {
        console.error('Error updating vehicle:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while attempting to update vehicle data.'
        });
    }
});

export default router;