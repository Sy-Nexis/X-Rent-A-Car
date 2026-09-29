import { Router, Request, Response } from 'express';
import { supabase } from '../db';

const router = Router();

// Helper to decode status and branch from DB encoding
function decodeVehicle(vehicle: any) {
    if (!vehicle) return vehicle;
    let status = vehicle.status;
    let branch = vehicle.branch;
    if (branch && branch.includes('|')) {
        const parts = branch.split('|');
        branch = parts[0];
        status = parts[1]; // e.g. 'In Prep' or 'Retired'
    } else if (status === 'Available') {
        status = 'Active';
    }
    return { ...vehicle, status, branch };
}

const getAllVehicles = async (req: Request, res: Response): Promise<void> => {
    try {
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase SELECT error:', error);
            res.status(500).json({
                success: false,
                message: 'Database Error while fetching vehicle data.'
            });
            return;
        }

        const decodedData = data ? data.map(decodeVehicle) : [];

        res.status(200).json({
            success: true,
            count: decodedData.length,
            data: decodedData
        });

    } catch (error: any) {
        console.error('Unexpected error fetching vehicles:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while fetching vehicle data.'
        });
    }
};

// GET all vehicles
router.get('/', getAllVehicles);
router.get('/view', getAllVehicles);

// /api/vehicles/view/:id or /api/vehicles/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || id === 'view') {
            return getAllVehicles(req, res);
        }

        let query = supabase.from('vehicles').select('*');
        if (!isNaN(Number(id))) {
            query = query.or(`id.eq.${id},vin.eq.${id}`);
        } else {
            query = query.eq('vin', String(id));
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
            console.error('Supabase SELECT single vehicle error:', error);
            res.status(500).json({
                success: false,
                message: 'Database Error while fetching vehicle details.'
            });
            return;
        }

        if (!data) {
            res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: decodeVehicle(data)
        });

    } catch (error: any) {
        console.error('Unexpected error fetching vehicle details:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while fetching vehicle details.'
        });
    }
});

export default router;