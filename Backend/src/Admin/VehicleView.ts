import { Router, Request, Response } from 'express';
import { supabase } from '../db';

const router = Router();

// /api/vehicles/view
router.get('/', async (req: Request, res: Response): Promise<void> => {
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

        res.status(200).json({
            success: true,
            count: data ? data.length : 0,
            data: data || []
        });

    } catch (error: any) {
        console.error('Unexpected error fetching vehicles:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while fetching vehicle data.'
        });
    }
});

// /api/vehicles/view/:id
// Get a single vehicle by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('id', id) // Assuming 'id' is a string or number that matches your DB schema
            .maybeSingle(); // Returns the object directly, or null if not found

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
            data: data
        });

    } catch (error: any) {
        console.error('Unexpected error fetching vehicle details:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

export default router;