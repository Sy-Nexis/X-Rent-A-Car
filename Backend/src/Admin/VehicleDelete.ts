import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// /api/vehicles/del
router.delete('/del', async (req: Request, res: Response): Promise<void> => {
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

        const deleteQuery = `DELETE FROM vehicles WHERE (vin = ? AND license_plate = ?)`;

        const [result]: any = await pool.execute(deleteQuery, [String(vin), String(plate)]);

        if (result.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: 'No vehicle found with that VIN or License Plate.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Vehicle with VIN ${vin} and Plate ${plate} has been successfully deleted.`,
        });

    } catch (error: any) {
        console.error('Error inserting vehicle:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while saving vehicle data.'
        });
    }
});

export default router;