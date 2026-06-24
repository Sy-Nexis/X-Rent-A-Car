import { Router, Request, Response } from 'express';
import { supabase } from '../db';

const router = Router();

// /api/vehicles/del
router.delete('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { vin, plate } = req.query;
        console.log(`DELETE request received for VIN: ${vin}, Plate: ${plate}`);

        // Validation: Ensure both are provided
        if (!vin || !plate) {
            res.status(400).json({
                success: false,
                message: 'Both "vin" and "plate" query parameters are required to delete a record.'
            });
            return;
        }

        const { data, error } = await supabase
            .from('vehicles')
            .delete()
            .eq('vin', String(vin))
            .eq('license_plate', String(plate))
            .select();

        if (error) {
            console.error('Supabase DELETE error:', error);
            res.status(500).json({
                success: false,
                message: 'Database Error while attempting to delete vehicle record.'
            });
            return;
        }

        // If data is empty, it means no rows matched the provided VIN & Plate combination
        if (!data || data.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No vehicle found with that VIN and License Plate combination.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Vehicle with VIN ${vin} and Plate ${plate} has been successfully deleted.`
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