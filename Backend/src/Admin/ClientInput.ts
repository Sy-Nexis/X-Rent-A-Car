import { Router, Request, Response } from 'express';
import { supabase } from '../db';

const router = Router();

// /api/clients/add
router.post('/add', async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            first_name, last_name, email, phone, address,
            city, state, zip_code, government_id, license_number, status
        } = req.body;

        const { data, error } = await supabase
            .from('clients')
            .insert([
                {
                    first_name, last_name, email, phone, address,
                    city, state, zip_code, government_id, license_number, status
                }
            ])
            .select();

        if (error) {
            console.error('Supabase INSERT error:', error);

            if (error.code === '23505') { // Postgres Unique Violation code
                res.status(400).json({
                    success: false,
                    message: 'A client with that Government ID or Email already exists.'
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: 'Database Error while saving client data.'
            });
            return;
        }

        res.status(201).json({
            success: true,
            message: 'Client successfully registered to the DB.',
            data: data
        });

    } catch (error: any) {
        console.error('Unexpected error inserting client:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while saving client data.'
        });
    }
});

// /api/clients/update
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

        const {
            first_name, last_name, email, phone, address,
            city, state, zip_code, license_number, status
        } = req.body;

        // Supabase automatically ignores 'undefined' values in the update object,
        // so it natively acts like your old COALESCE statement!
        const { data, error } = await supabase
            .from('clients')
            .update({
                first_name, last_name, email, phone, address,
                city, state, zip_code, license_number, status
            })
            .eq('government_id', String(government))
            .select();

        if (error) {
            console.error('Supabase UPDATE error:', error);
            res.status(500).json({
                success: false,
                message: 'Database Error while attempting to update client data.'
            });
            return;
        }

        // If no data is returned, the government_id didn't match any records
        if (!data || data.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No client found matching that Government ID.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Client with Government ID: ${government} has been successfully updated.`,
            data: data
        });

    } catch (error: any) {
        console.error('Unexpected error updating client:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while attempting to update client data.'
        });
    }
});

export default router;