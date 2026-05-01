import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// /api/vehicles/view
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');

        res.status(200).json({
            success: true,
            count: (rows as any[]).length,
            data: rows
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