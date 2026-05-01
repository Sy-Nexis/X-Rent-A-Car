import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// /api/clients/del
router.delete('/del', async (req: Request, res: Response): Promise<void> => {
    try {
        const { nic } = req.query;
        console.log(`DELETE request received for NIC: ${nic}`);

        // Validation: Ensure both are provided
        if (!nic) {
            res.status(400).json({
                success: false,
                message: 'Nic query parameter is required to delete a record.'
            });
            return;
        }

        const deleteQuery = `DELETE FROM client WHERE (government_id = ? )`;

        const [result]: any = await pool.execute(deleteQuery, [String(nic)]);

        if (result.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: 'No client found with that NIC.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Client with ${nic} has been successfully deleted.`,
        });

    } catch (error: any) {
        console.error('Error inserting client:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while saving client data.'
        });
    }
});

export default router;