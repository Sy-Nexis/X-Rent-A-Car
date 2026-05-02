import { Router, Request, Response } from 'express';
import { supabase } from '../db'; // Ensure this points to your initialized Supabase client

const router = Router();

// /api/clients/view
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase SELECT error:', error);
            res.status(500).json({
                success: false,
                message: 'Database Error while fetching client data.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            count: data ? data.length : 0,
            data: data || []
        });

    } catch (error: any) {
        console.error('Unexpected error fetching clients:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while fetching client data.'
        });
    }
});

// /api/clients/view/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('government_id', String(id))
            .maybeSingle(); // Returns the object directly, or null if not found

        if (error) {
            console.error('Supabase SELECT single client error:', error);
            res.status(500).json({
                success: false,
                message: 'Database Error while fetching client details.'
            });
            return;
        }

        // If data is null, the client doesn't exist
        if (!data) {
            res.status(404).json({
                success: false,
                message: 'Client not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: data
        });

    } catch (error: any) {
        console.error('Unexpected error fetching client details:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

export default router;