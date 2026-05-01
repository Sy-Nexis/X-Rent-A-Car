import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// /api/clients/del
router.delete('/del', async (req: Request, res: Response): Promise<void> => {
    try {
        const { vin, plate } = req.query;
        console.log(`DELETE request received for `);

        // Validation: Ensure both are provided
        if (!vin || !plate) {
            res.status(400).json({
                success: false,
                message: '........ query parameter are required to delete a record.'
            });
            return;
        }

        const deleteQuery = `DELETE FROM client WHERE ()`;

        const [result]: any = await pool.execute(deleteQuery, [String(vin), String(plate)]);

        if (result.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: 'No client found with that VIN or License Plate.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `client with ................ has been successfully deleted.`,
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