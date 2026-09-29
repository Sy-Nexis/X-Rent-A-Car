import { Router, Request, Response } from 'express';
import { supabase } from '../db';
import { cache } from '../utils/cache';

const router = Router();

// /api/vehicles/del
router.delete('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { vin, plate, id } = req.query;
        console.log(`DELETE request received - VIN: ${vin}, Plate: ${plate}, ID: ${id}`);

        if (!vin && !plate && !id) {
            res.status(400).json({
                success: false,
                message: 'At least one query parameter ("id", "vin", or "plate") is required to delete a record.'
            });
            return;
        }

        let deleteQuery = supabase.from('vehicles').delete();

        if (id) {
            deleteQuery = deleteQuery.eq('id', id);
        } else if (vin && plate) {
            deleteQuery = deleteQuery.eq('vin', String(vin)).eq('license_plate', String(plate));
        } else if (vin) {
            deleteQuery = deleteQuery.eq('vin', String(vin));
        } else if (plate) {
            deleteQuery = deleteQuery.eq('license_plate', String(plate));
        }

        const { data, error } = await deleteQuery.select();

        if (error) {
            console.error('Supabase DELETE error:', error);
            res.status(500).json({
                success: false,
                message: 'Database Error while attempting to delete vehicle record.'
            });
            return;
        }

        if (!data || data.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No vehicle found matching the deletion criteria.'
            });
            return;
        }

        cache.invalidate('vehicle');

        res.status(200).json({
            success: true,
            message: `Vehicle record has been successfully deleted from database.`
        });

    } catch (error: any) {
        console.error('Unexpected error deleting vehicle:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error while deleting vehicle data.'
        });
    }
});

export default router;