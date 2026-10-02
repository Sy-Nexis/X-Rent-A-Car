import { Router, Request, Response } from 'express';
import { cache } from '../utils/cache';
import { recordAuditLog } from './LogRoutes';
import { deleteVehicle } from '../services/dynamoVehicleService';

const router = Router();

// /api/vehicles/del
router.delete('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { vin, plate, id } = req.query;
        console.log(`DYNAMODB DELETE request received - VIN: ${vin}, Plate: ${plate}, ID: ${id}`);

        if (!vin && !plate && !id) {
            res.status(400).json({
                success: false,
                message: 'At least one query parameter ("id", "vin", or "plate") is required to delete a record.'
            });
            return;
        }

        const deletedVeh = await deleteVehicle(
            id ? Number(id) : undefined,
            vin ? String(vin) : undefined,
            plate ? String(plate) : undefined
        );

        if (!deletedVeh) {
            res.status(404).json({
                success: false,
                message: 'No vehicle found matching the deletion criteria in DynamoDB.'
            });
            return;
        }

        const vehName = `${deletedVeh.year || ''} ${deletedVeh.make || ''} ${deletedVeh.model || ''} (${deletedVeh.license_plate || deletedVeh.vin || id})`.trim();

        recordAuditLog({
            userName: (req.headers['x-user-name'] as string) || (req.query.user_name as string) || 'Alex Rivera',
            userRole: (req.headers['x-user-role'] as string) || (req.query.user_role as string) || 'Fleet Manager',
            action: 'Deleted Vehicle',
            entityType: 'Vehicle',
            entityId: deletedVeh.id,
            details: `Deleted vehicle ${vehName} from DynamoDB fleet database.`
        }).catch(() => {});

        cache.invalidate('vehicle');

        res.status(200).json({
            success: true,
            message: `Vehicle record has been successfully deleted from DynamoDB database.`
        });

    } catch (error: any) {
        console.error('Unexpected error deleting vehicle from DynamoDB:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error while deleting vehicle data.'
        });
    }
});

export default router;