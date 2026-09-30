import { Router, Request, Response } from 'express';
import { supabase } from '../db';
import { cache } from '../utils/cache';
import { recordAuditLog } from './LogRoutes';

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
        const rawDailyRate = Number(dailyRate) || Number(daily_rate) || 0;
        const numericDailyRate = isNaN(rawDailyRate) ? 0 : Math.min(Math.max(rawDailyRate, 0), 99999999.99);

        const rawMileage = Number(mileage) || 0;
        const numericMileage = isNaN(rawMileage) ? 0 : Math.min(Math.max(Math.floor(rawMileage), 0), 2147483647);

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

        // Invalidate vehicle cache immediately
        cache.invalidate('vehicle');

        // Record audit log
        recordAuditLog({
            userName: req.body.user_name || req.body.userName || 'Alex Rivera',
            userRole: req.body.user_role || req.body.userRole || 'Fleet Manager',
            action: 'Registered Vehicle',
            entityType: 'Vehicle',
            entityId: data && data[0] ? data[0].id : undefined,
            details: `Added new vehicle ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} (${vehicleData.license_plate}) to fleet.`
        }).catch(() => {});

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
        const { vin, id, licensePlate, plate } = req.query;
        const targetVin = vin || req.body.vin;
        const targetId = id || req.body.id;
        const targetPlate = licensePlate || plate || req.body.licensePlate || req.body.license_plate;

        if (!targetVin && !targetId && !targetPlate) {
            res.status(400).json({
                success: false,
                message: 'Please provide the vehicle VIN, ID, or License Plate in query parameters or request body.'
            });
            return;
        }

        const {
            make, model, year, transmission, fuelType,
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
        let findQuery = supabase.from('vehicles').select('*');
        if (targetId) {
            findQuery = findQuery.eq('id', targetId);
        } else if (targetVin) {
            findQuery = findQuery.eq('vin', String(targetVin));
        } else if (targetPlate) {
            findQuery = findQuery.eq('license_plate', String(targetPlate));
        }

        const { data: existingVehicle, error: fetchError } = await findQuery.maybeSingle();

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
                message: 'No vehicle found matching that identifier.'
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

        // Normalize incoming fields
        const yearVal = year !== undefined ? Number(year) : (req.body.year !== undefined ? Number(req.body.year) : undefined);
        const mileageVal = mileage !== undefined ? Number(mileage) : (req.body.mileage !== undefined ? Number(req.body.mileage) : undefined);
        const dailyRateRaw = dailyRate !== undefined ? dailyRate : req.body.daily_rate;
        const numericDailyRate = dailyRateRaw !== undefined ? Number(dailyRateRaw) : undefined;
        const licensePlateVal = licensePlate || req.body.license_plate || undefined;
        const fuelTypeVal = fuelType || req.body.fuel_type || undefined;
        const engineCapacityVal = engineCapacity || req.body.engine_capacity || undefined;

        // Build clean update object without undefined overwrites
        const updateData: any = {};
        if (make !== undefined) updateData.make = String(make);
        if (model !== undefined) updateData.model = String(model);
        if (yearVal !== undefined && !isNaN(yearVal)) updateData.year = yearVal;
        if (transmission !== undefined) updateData.transmission = String(transmission);
        if (color !== undefined) updateData.color = String(color);
        if (mileageVal !== undefined && !isNaN(mileageVal)) updateData.mileage = mileageVal;
        if (dbBranch !== undefined) updateData.branch = dbBranch;
        if (dbStatus !== undefined) updateData.status = dbStatus;
        if (licensePlateVal !== undefined) updateData.license_plate = String(licensePlateVal);
        if (fuelTypeVal !== undefined) updateData.fuel_type = String(fuelTypeVal);
        if (engineCapacityVal !== undefined) updateData.engine_capacity = String(engineCapacityVal);
        if (numericDailyRate !== undefined && !isNaN(numericDailyRate)) updateData.daily_rate = numericDailyRate;

        console.log("EXECUTING_VEHICLE_UPDATE:", { id: existingVehicle.id, updateData });

        const { data, error } = await supabase
            .from('vehicles')
            .update(updateData)
            .eq('id', existingVehicle.id)
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
                message: 'No vehicle found matching that identifier.'
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

        // Invalidate vehicle cache immediately
        cache.invalidate('vehicle');

        const updatedVeh = decodedData[0] || existingVehicle;
        const changedFields = Object.keys(updateData).join(', ');
        recordAuditLog({
            userName: (req.headers['x-user-name'] as string) || req.body.user_name || req.body.userName || 'Alex Rivera',
            userRole: (req.headers['x-user-role'] as string) || req.body.user_role || req.body.userRole || 'Fleet Manager',
            action: 'Updated Vehicle',
            entityType: 'Vehicle',
            entityId: existingVehicle.id,
            details: `Updated vehicle ${updatedVeh.make} ${updatedVeh.model} (${updatedVeh.license_plate || updatedVeh.vin || existingVehicle.id}). Modified fields: [${changedFields || 'details'}].`
        }).catch(() => {});

        res.status(200).json({
            success: true,
            message: `Vehicle ${existingVehicle.make} ${existingVehicle.model} (${existingVehicle.vin}) has been successfully updated.`,
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