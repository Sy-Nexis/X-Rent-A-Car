import { Router, Request, Response } from 'express';
import { supabase } from '../db';

const router = Router();

// /api/vehicles/add
router.post('/add', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("VEHICLE_ADD_REQUEST:", req.body);
        const {
            make, model, year, vin, licensePlate, license_plate, transmission,
            fuelType, fuel_type, engineCapacity, engine_capacity, color, mileage, dailyRate, daily_rate, location, branch, status
        } = req.body;

        // Map incoming fields with extreme robustness
        // 1. OVERFLOW GUARD: Prevent NUMERIC(10,2) overflow for daily_rate
        const numericDailyRate = Number(dailyRate) || Number(daily_rate) || 0;
        if (numericDailyRate >= 100000000) {
            res.status(400).json({
                success: false,
                message: 'Daily rate is too high. Maximum allowed value is 99,999,999.99.'
            });
            return;
        }

        // 2. MILEAGE GUARD: Prevent potential overflow
        const numericMileage = Number(mileage) || 0;
        if (numericMileage >= 1000000000) {
            res.status(400).json({
                success: false,
                message: 'Mileage is too high.'
            });
            return;
        }

        // Map status and branch values to avoid DB enum constraint violations
        const rawStatus = String(status || 'Available').trim();
        let dbStatus = 'Available';
        let dbBranch = String(branch || 'Main');

        if (rawStatus.toLowerCase() === 'in prep' || rawStatus.toLowerCase() === 'inprep') {
            dbStatus = 'Maintenance';
            dbBranch = `${dbBranch}|In Prep`;
        } else if (rawStatus.toLowerCase() === 'retired') {
            dbStatus = 'Maintenance';
            dbBranch = `${dbBranch}|Retired`;
        } else if (rawStatus.toLowerCase() === 'active' || rawStatus.toLowerCase() === 'available') {
            dbStatus = 'Available';
        } else if (rawStatus.toLowerCase() === 'maintenance') {
            dbStatus = 'Maintenance';
        } else if (rawStatus.toLowerCase() === 'rented') {
            dbStatus = 'Rented';
        } else {
            dbStatus = 'Available';
        }

        const vehicleData = {
            make: String(make || ''),
            model: String(model || ''),
            year: Number(year) || new Date().getFullYear(),
            vin: String(vin || ''),
            license_plate: String(licensePlate || license_plate || ''),
            transmission: String(transmission || 'Automatic'),
            fuel_type: String(fuelType || fuel_type || 'Petrol'),
            engine_capacity: String(engineCapacity || engine_capacity || ''),
            color: String(color || ''),
            mileage: numericMileage,
            daily_rate: numericDailyRate,
            branch: dbBranch,
            status: dbStatus
        };

        console.log("INSERTING_VEHICLE_DATA:", vehicleData);

        const { data, error } = await supabase
            .from('vehicles')
            .insert([vehicleData])
            .select();

        if (error) {
            console.error('Supabase INSERT error:', error);
            try {
                const fs = require('fs');
                fs.writeFileSync('supabase_error.log', JSON.stringify({
                    timestamp: new Date().toISOString(),
                    error,
                    payload: vehicleData
                }, null, 2));
            } catch (e) {}

            if (error.code === '23505') {
                res.status(400).json({
                    success: false,
                    message: 'A vehicle with that VIN or License Plate already exists.'
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: `Database Error: ${error.message}`,
                detail: error.details,
                hint: error.hint
            });
            return;
        }

        // Decode returned data so that frontend receives the expected status strings
        const decodedData = data ? data.map(vehicle => {
            let statusVal = vehicle.status;
            let branchVal = vehicle.branch;
            if (branchVal && branchVal.includes('|')) {
                const parts = branchVal.split('|');
                branchVal = parts[0];
                statusVal = parts[1];
            } else if (statusVal === 'Available') {
                statusVal = 'Active';
            }
            return { ...vehicle, status: statusVal, branch: branchVal };
        }) : [];

        res.status(201).json({
            success: true,
            message: 'Vehicle successfully registered to the fleet.',
            data: decodedData
        });

    } catch (error: any) {
        console.error('Unexpected error inserting vehicle:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while saving vehicle data.',
            detail: error.message
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

        // 1. OVERFLOW GUARD: Prevent NUMERIC(10,2) overflow for daily_rate
        if (dailyRate && Number(dailyRate) >= 100000000) {
            res.status(400).json({
                success: false,
                message: 'Daily rate is too high. Maximum allowed value is 99,999,999.99.'
            });
            return;
        }

        // Fetch existing vehicle to merge fields cleanly and preserve branch/status encoding
        const { data: existingVehicle, error: fetchError } = await supabase
            .from('vehicles')
            .select('*')
            .eq('vin', String(vin))
            .maybeSingle();

        if (fetchError) {
            console.error('Supabase fetch error during update:', fetchError);
            res.status(500).json({
                success: false,
                message: 'Database Error while checking vehicle details.'
            });
            return;
        }

        if (!existingVehicle) {
            res.status(404).json({
                success: false,
                message: 'No vehicle found matching that VIN.'
            });
            return;
        }

        const currentStatus = existingVehicle.status || 'Available';
        const currentBranch = existingVehicle.branch || 'Main';

        // Extract clean branch and current real status from existing record
        let cleanBranch = currentBranch;
        let realStatus = currentStatus;
        if (currentBranch && currentBranch.includes('|')) {
            const parts = currentBranch.split('|');
            cleanBranch = parts[0];
            realStatus = parts[1]; // e.g. 'In Prep' or 'Retired'
        } else if (currentStatus === 'Available') {
            realStatus = 'Active';
        }

        // Merge existing fields with update request values
        const newStatus = status !== undefined ? String(status).trim() : realStatus;
        const newBranch = branch !== undefined ? String(branch).trim() : cleanBranch;

        // Map status/branch to DB representation
        let dbStatus = 'Available';
        let dbBranch = newBranch;

        if (newStatus.toLowerCase() === 'in prep' || newStatus.toLowerCase() === 'inprep') {
            dbStatus = 'Maintenance';
            dbBranch = `${newBranch}|In Prep`;
        } else if (newStatus.toLowerCase() === 'retired') {
            dbStatus = 'Maintenance';
            dbBranch = `${newBranch}|Retired`;
        } else if (newStatus.toLowerCase() === 'active' || newStatus.toLowerCase() === 'available') {
            dbStatus = 'Available';
        } else if (newStatus.toLowerCase() === 'maintenance') {
            dbStatus = 'Maintenance';
        } else if (newStatus.toLowerCase() === 'rented') {
            dbStatus = 'Rented';
        } else {
            dbStatus = 'Available';
        }

        // Map camelCase body payload to snake_case database columns
        const updateData = {
            make,
            model,
            year: year ? Number(year) : undefined,
            transmission,
            color,
            mileage: mileage ? Number(mileage) : undefined,
            branch: dbBranch,
            status: dbStatus,
            license_plate: licensePlate,
            fuel_type: fuelType,
            engine_capacity: engineCapacity,
            daily_rate: dailyRate ? Number(dailyRate) : undefined
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

        // Decode returned data so frontend receives clean status and branch
        const decodedData = data.map(vehicle => {
            let statusVal = vehicle.status;
            let branchVal = vehicle.branch;
            if (branchVal && branchVal.includes('|')) {
                const parts = branchVal.split('|');
                branchVal = parts[0];
                statusVal = parts[1];
            } else if (statusVal === 'Available') {
                statusVal = 'Active';
            }
            return { ...vehicle, status: statusVal, branch: branchVal };
        });

        res.status(200).json({
            success: true,
            message: `Vehicle with VIN ${vin} has been successfully updated.`,
            data: decodedData
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