import { Router, Request, Response } from 'express';
import { supabase } from '../db';
import { cache } from '../utils/cache';

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

        cache.invalidate('client');

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
        const { government, government_id, id, nic, email: queryEmail } = req.query;
        const targetGovId = government || government_id || nic || req.body.government_id || req.body.governmentId;
        const targetId = id || req.body.id;
        const targetEmail = queryEmail || req.body.email;

        console.log(`UPDATE client request received - GovID: ${targetGovId}, ID: ${targetId}, Email: ${targetEmail}`);

        if (!targetGovId && !targetId && !targetEmail) {
            res.status(400).json({
                success: false,
                message: 'Please provide the client identifier (government_id, id, or email)'
            });
            return;
        }

        // 1. Locate existing client record by ID, government_id, or email
        let findQuery = supabase.from('clients').select('*');
        if (targetId && !isNaN(Number(targetId))) {
            findQuery = findQuery.or(`id.eq.${Number(targetId)},government_id.eq.${targetId}`);
        } else if (targetGovId) {
            if (!isNaN(Number(targetGovId))) {
                findQuery = findQuery.or(`id.eq.${Number(targetGovId)},government_id.eq.${String(targetGovId)}`);
            } else {
                findQuery = findQuery.eq('government_id', String(targetGovId));
            }
        } else if (targetEmail) {
            findQuery = findQuery.eq('email', String(targetEmail));
        }

        const { data: existingClient, error: fetchError } = await findQuery.maybeSingle();

        if (fetchError) {
            console.error('Supabase fetch error during client update:', fetchError);
            res.status(500).json({
                success: false,
                message: 'Database Error while checking client details.'
            });
            return;
        }

        if (!existingClient) {
            res.status(404).json({
                success: false,
                message: 'No client found matching the provided identifier.'
            });
            return;
        }

        // 2. Normalize incoming fields (support snake_case and camelCase)
        const {
            first_name, firstName,
            last_name, lastName,
            name,
            email, phone, address,
            city, state,
            zip_code, zipCode,
            license_number, licenseNumber,
            status
        } = req.body;

        let derivedFirstName = first_name || firstName;
        let derivedLastName = last_name || lastName;

        if (!derivedFirstName && name && typeof name === 'string') {
            const parts = name.trim().split(' ');
            derivedFirstName = parts[0];
            derivedLastName = parts.slice(1).join(' ') || '';
        }

        const updateData: any = {};
        if (derivedFirstName !== undefined) updateData.first_name = String(derivedFirstName);
        if (derivedLastName !== undefined) updateData.last_name = String(derivedLastName);
        if (email !== undefined) updateData.email = String(email);
        if (phone !== undefined) updateData.phone = String(phone);
        if (address !== undefined) updateData.address = String(address);
        if (city !== undefined) updateData.city = String(city);
        if (state !== undefined) updateData.state = String(state);
        if (zip_code !== undefined || zipCode !== undefined) updateData.zip_code = String(zip_code || zipCode);
        if (license_number !== undefined || licenseNumber !== undefined) updateData.license_number = String(license_number || licenseNumber);
        if (status !== undefined) updateData.status = String(status);

        console.log("EXECUTING_CLIENT_UPDATE:", { id: existingClient.id, updateData });

        // 3. Execute update on verified client ID
        const { data, error } = await supabase
            .from('clients')
            .update(updateData)
            .eq('id', existingClient.id)
            .select();

        if (error) {
            console.error('Supabase UPDATE client error:', error);
            res.status(500).json({
                success: false,
                message: `Database Error: ${error.message}`
            });
            return;
        }

        if (!data || data.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Failed to apply update to client record.'
            });
            return;
        }

        // Invalidate client cache immediately
        cache.invalidate('client');

        res.status(200).json({
            success: true,
            message: `Client ${existingClient.first_name} ${existingClient.last_name} has been successfully updated.`,
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