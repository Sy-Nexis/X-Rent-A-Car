import { Router, Request, Response } from 'express';
import { supabase } from '../db';

const router = Router();

// /api/vehicles/add
router.post('/add', async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            make, model, year, vin, license_plate, transmission,
            fuel_type, engine_capacity, color, mileage, daily_rate, branch, status
        } = req.body;

        const { data, error } = await supabase
            .from('vehicles')
            .insert([
                {
                    make, model, year, vin, license_plate, transmission,
                    fuel_type, engine_capacity, color, mileage, daily_rate, branch, status
                }
            ])
            .select();

        if (error) {
            console.error('Supabase INSERT error:', error);

            if (error.code === '23505') { // Postgres Unique Violation code
                res.status(400).json({
                    success: false,
                    message: 'A vehicle with that VIN or License Plate already exists.'
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: 'Database Error while saving vehicle data.'
            });
            return;
        }

        res.status(201).json({
            success: true,
            message: 'Vehicle successfully registered to the fleet.',
            data: data
        });

    } catch (error: any) {
        console.error('Unexpected error inserting vehicle:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while saving vehicle data.'
        });
    }
});

// /api/vehicles/update
router.put('/update', async (req: Request, res: Response): Promise<void> => {
    try {
        const { vin } = req.query;

        if (!vin) {
            res.status(400).json({
                success: false,
                message: 'Please provide the vehicle VIN in the query parameters.'
            });
            return;
        }

        const {
            make, model, year, licensePlate, transmission, fuelType,
            engineCapacity, color, mileage, dailyRate, branch, status
        } = req.body;

        // Map camelCase body payload to snake_case database columns.
        // Supabase automatically ignores undefined values, acting like your old COALESCE logic!
        const updateData = {
            make,
            model,
            year,
            transmission,
            color,
            mileage,
            branch,
            status,
            license_plate: licensePlate,
            fuel_type: fuelType,
            engine_capacity: engineCapacity,
            daily_rate: dailyRate
        };

        const { data, error } = await supabase
            .from('vehicles')
            .update(updateData)
            .eq('vin', String(vin))
            .select();

        if (error) {
            console.error('Supabase UPDATE error:', error);
            res.status(500).json({
                success: false,
                message: 'Database Error while attempting to update vehicle data.'
            });
            return;
        }


        if (!data || data.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No vehicle found matching that VIN.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Vehicle with VIN ${vin} has been successfully updated.`,
            data: data
        });

    } catch (error: any) {
        console.error('Unexpected error updating vehicle:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while attempting to update vehicle data.'
        });
    }
});

export default router;