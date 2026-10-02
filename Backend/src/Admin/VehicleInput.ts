import { Router, Request, Response } from 'express';
import { cache } from '../utils/cache';
import { recordAuditLog } from './LogRoutes';
import {
    createVehicle,
    updateVehicle,
    getVehicleById,
    getVehicleByVin,
    getVehicleByPlate
} from '../services/dynamoVehicleService';

const router = Router();

// /api/vehicles/add
router.post('/add', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("DYNAMODB_VEHICLE_ADD_REQUEST:", req.body);
        const {
            make, model, year, vin, licensePlate, license_plate, transmission,
            fuelType, fuel_type, engineCapacity, engine_capacity, color, mileage, dailyRate, daily_rate, location, branch, status
        } = req.body;

        const rawDailyRate = Number(dailyRate) || Number(daily_rate) || 0;
        const numericDailyRate = isNaN(rawDailyRate) ? 0 : Math.min(Math.max(rawDailyRate, 0), 99999999.99);

        const rawMileage = Number(mileage) || 0;
        const numericMileage = isNaN(rawMileage) ? 0 : Math.min(Math.max(Math.floor(rawMileage), 0), 2147483647);

        const targetPlate = String(licensePlate || license_plate || '').trim();
        const targetVin = String(vin || '').trim();

        // 1. UNIQUE CONSTRAINT CHECK (Plate & VIN)
        if (targetVin) {
            const existingVin = await getVehicleByVin(targetVin);
            if (existingVin) {
                res.status(400).json({
                    success: false,
                    message: 'A vehicle with that VIN already exists in DynamoDB.'
                });
                return;
            }
        }

        if (targetPlate) {
            const existingPlate = await getVehicleByPlate(targetPlate);
            if (existingPlate) {
                res.status(400).json({
                    success: false,
                    message: 'A vehicle with that License Plate already exists in DynamoDB.'
                });
                return;
            }
        }

        const vehicleData = {
            make: String(make || ''),
            model: String(model || ''),
            year: Number(year) || new Date().getFullYear(),
            vin: targetVin,
            license_plate: targetPlate,
            transmission: String(transmission || 'Automatic'),
            fuel_type: String(fuelType || fuel_type || 'Petrol'),
            engine_capacity: String(engineCapacity || engine_capacity || ''),
            color: String(color || ''),
            mileage: numericMileage,
            daily_rate: numericDailyRate,
            branch: String(branch || 'Colombo Central'),
            status: String(status || 'Available')
        };

        const newVehicle = await createVehicle(vehicleData);

        // Invalidate vehicle cache immediately
        cache.invalidate('vehicle');

        // Record audit log
        recordAuditLog({
            userName: (req.headers['x-user-name'] as string) || req.body.user_name || req.body.userName || 'Alex Rivera',
            userRole: (req.headers['x-user-role'] as string) || req.body.user_role || req.body.userRole || 'Fleet Manager',
            action: 'Registered Vehicle',
            entityType: 'Vehicle',
            entityId: newVehicle.id,
            details: `Added new vehicle ${newVehicle.year} ${newVehicle.make} ${newVehicle.model} (${newVehicle.license_plate}) to fleet.`
        }).catch(() => {});

        res.status(201).json({
            success: true,
            message: 'Vehicle successfully registered in DynamoDB.',
            data: [newVehicle]
        });

    } catch (error: any) {
        console.error('Unexpected error inserting vehicle into DynamoDB:', error);
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

        let existingVehicle = null;
        if (targetId) {
            existingVehicle = await getVehicleById(Number(targetId));
        } else if (targetVin) {
            existingVehicle = await getVehicleByVin(String(targetVin));
        } else if (targetPlate) {
            existingVehicle = await getVehicleByPlate(String(targetPlate));
        }

        if (!existingVehicle) {
            res.status(404).json({
                success: false,
                message: 'No vehicle found matching that identifier in DynamoDB.'
            });
            return;
        }

        const {
            make, model, year, transmission, fuelType,
            engineCapacity, color, mileage, dailyRate, branch, status
        } = req.body;

        const updateData: any = {};
        if (make !== undefined) updateData.make = String(make);
        if (model !== undefined) updateData.model = String(model);
        if (year !== undefined) updateData.year = Number(year);
        if (transmission !== undefined) updateData.transmission = String(transmission);
        if (color !== undefined) updateData.color = String(color);
        if (mileage !== undefined) updateData.mileage = Number(mileage);
        if (branch !== undefined) updateData.branch = String(branch);
        if (status !== undefined) updateData.status = String(status);
        if (req.body.licensePlate || req.body.license_plate) updateData.license_plate = String(req.body.licensePlate || req.body.license_plate);
        if (fuelType || req.body.fuel_type) updateData.fuel_type = String(fuelType || req.body.fuel_type);
        if (engineCapacity || req.body.engine_capacity) updateData.engine_capacity = String(engineCapacity || req.body.engine_capacity);
        if (dailyRate !== undefined || req.body.daily_rate !== undefined) updateData.daily_rate = Number(dailyRate !== undefined ? dailyRate : req.body.daily_rate);

        const updated = await updateVehicle(existingVehicle.id, updateData);

        // Compute exact fields that ACTUALLY changed
        const changedDiffs: string[] = [];
        function checkFieldDiff(label: string, oldVal: any, newVal: any, formatFn?: (v: any) => string) {
            if (newVal === undefined) return;
            const strOld = (oldVal === null || oldVal === undefined) ? '' : String(oldVal).trim();
            const strNew = (newVal === null || newVal === undefined) ? '' : String(newVal).trim();

            if (!isNaN(Number(strOld)) && !isNaN(Number(strNew)) && strOld !== '' && strNew !== '') {
                if (Number(strOld) !== Number(strNew)) {
                    const fOld = formatFn ? formatFn(oldVal) : strOld;
                    const fNew = formatFn ? formatFn(newVal) : strNew;
                    changedDiffs.push(`${label}: ${fOld} → ${fNew}`);
                }
                return;
            }

            if (strOld.toLowerCase() !== strNew.toLowerCase()) {
                const fOld = formatFn ? formatFn(oldVal) : (strOld || 'None');
                const fNew = formatFn ? formatFn(newVal) : (strNew || 'None');
                changedDiffs.push(`${label}: ${fOld} → ${fNew}`);
            }
        }

        checkFieldDiff('Make', existingVehicle.make, updateData.make);
        checkFieldDiff('Model', existingVehicle.model, updateData.model);
        checkFieldDiff('Year', existingVehicle.year, updateData.year);
        checkFieldDiff('Transmission', existingVehicle.transmission, updateData.transmission);
        checkFieldDiff('Color', existingVehicle.color, updateData.color);
        checkFieldDiff('Mileage', existingVehicle.mileage, updateData.mileage, (v) => `${Number(v).toLocaleString()} km`);
        checkFieldDiff('Daily Rate', existingVehicle.daily_rate, updateData.daily_rate, (v) => `LKR ${Number(v).toLocaleString()}`);
        checkFieldDiff('Plate', existingVehicle.license_plate, updateData.license_plate);
        checkFieldDiff('Fuel', existingVehicle.fuel_type, updateData.fuel_type);
        checkFieldDiff('Engine', existingVehicle.engine_capacity, updateData.engine_capacity);
        checkFieldDiff('Status', existingVehicle.status, updateData.status);
        checkFieldDiff('Branch', existingVehicle.branch, updateData.branch);

        const changeDescription = changedDiffs.length > 0
            ? `Updated vehicle ${updated?.make} ${updated?.model} (${updated?.license_plate || updated?.vin || existingVehicle.id}). Changed: ${changedDiffs.join(', ')}.`
            : `Saved vehicle details for ${updated?.make} ${updated?.model} (${updated?.license_plate || updated?.vin}) with no field changes.`;

        recordAuditLog({
            userName: (req.headers['x-user-name'] as string) || req.body.user_name || req.body.userName || 'Alex Rivera',
            userRole: (req.headers['x-user-role'] as string) || req.body.user_role || req.body.userRole || 'Fleet Manager',
            action: 'Updated Vehicle',
            entityType: 'Vehicle',
            entityId: existingVehicle.id,
            details: changeDescription
        }).catch(() => {});

        cache.invalidate('vehicle');

        res.status(200).json({
            success: true,
            message: `Vehicle ${existingVehicle.make} ${existingVehicle.model} has been successfully updated in DynamoDB.`,
            data: [updated]
        });

    } catch (error: any) {
        console.error('Unexpected error updating vehicle in DynamoDB:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error while attempting to update vehicle data.'
        });
    }
});

export default router;