import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// /api/clients/add
router.post('/add', async (req: Request, res: Response): Promise<void> => {
    try {
        const { first_name, last_name, email, phone, address, city, state, zip_code, government_id, license_number, status } = req.body;
        // Secure SQL --> ? -- SQL INJECTION Can't
        const insertQuery = `INSERT INTO clients ( first_name, last_name, email,  phone, address, city, state, zip_code, government_id, license_number, status ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(insertQuery, [first_name, last_name, email, phone, address, city, state, zip_code, government_id, license_number, status]);



        res.status(201).json({
            success: true,
            message: 'Client successfully registered to the DB.',
            data: result
        });

    } catch (error: any) {
        console.error('Error inserting client:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while saving client data.'
        });
    }
});

router.put('/update', async (req: Request, res: Response): Promise<void> => {
    try {
        const { government } = req.query;

        if (!government) {
            res.status(400).json({
                success: false,
                message: 'Please provide the client government id'
            });
            return;
        }

        const { first_name, last_name, email, phone, address, city, state, zip_code, government_id, license_number, status } = req.body;


        //COALESCE(?, nameee) --> if NULL NO UPDATE
        const updateQuery = `
            UPDATE clients 
            SET  first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name), email = COALESCE(?, email), phone = COALESCE(?, phone), address = COALESCE(?, address), city = COALESCE(?, city), state = COALESCE(?, state), zip_code = COALESCE(?, zip_code), license_number = COALESCE(?, license_number), status = COALESCE(?, status)
            WHERE government_id = ? `;

        const [result]: any = await pool.execute(updateQuery, [
            first_name ?? null,
            last_name ?? null,
            email ?? null,
            phone ?? null,
            address ?? null,
            city ?? null,
            state ?? null,
            zip_code ?? null,
            license_number ?? null,
            status ?? null,
            String(government)
        ]);

        if (result.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: 'No client found matching that VIN.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `CLient with Government ID: ${government} has been successfully updated.`
        });

    } catch (error: any) {
        console.error('Error updating client:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while attempting to update client data.'
        });
    }
});

export default router;