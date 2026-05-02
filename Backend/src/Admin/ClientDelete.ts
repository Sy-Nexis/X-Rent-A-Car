import { Router, Request, Response } from 'express';
import { supabase } from '../db';


const router = Router();

// /api/clients/del
router.delete('/del', async (req: Request, res: Response): Promise<void> => {
    try {
        const { nic } = req.query;
        console.log(`DELETE request received for NIC: ${nic}`);

        // Validation: Ensure nic is provided
        if (!nic) {
            res.status(400).json({
                success: false,
                message: 'Nic query parameter is required to delete a record.'
            });
            return;
        }

        const { data, error } = await supabase
            .from('clients')
            .delete()
            .eq('government_id', String(nic))
            .select();

        if (error) {
            console.error('Supabase DELETE error:', error);
            res.status(500).json({
                success: false,
                message: 'Database Error while terminating client record.'
            });
            return;
        }

        // If data is empty, it means no rows matched the provided NIC
        if (!data || data.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No client found with that NIC.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Client with NIC ${nic} has been successfully deleted.`,
        });

    } catch (error: any) {
        console.error('Unexpected error deleting client:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while terminating client record.'
        });
    }
});

export default router;