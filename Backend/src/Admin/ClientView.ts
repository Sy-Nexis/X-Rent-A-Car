import { Router, Request, Response } from 'express';
import { supabase } from '../db';

const router = Router();

// Helper to normalize client fields
function decodeClient(client: any) {
    if (!client) return client;
    const fullName = `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.name || 'Corporate Client';
    return {
        ...client,
        name: fullName,
        contact: fullName,
        governmentId: client.government_id,
        government_id: client.government_id,
        licenseNumber: client.license_number,
        license_number: client.license_number,
        zipCode: client.zip_code,
        zip_code: client.zip_code,
    };
}

const getAllClients = async (req: Request, res: Response): Promise<void> => {
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

        const decodedData = data ? data.map(decodeClient) : [];

        res.status(200).json({
            success: true,
            count: decodedData.length,
            data: decodedData
        });

    } catch (error: any) {
        console.error('Unexpected error fetching clients:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while fetching client data.'
        });
    }
};

// GET all clients
router.get('/', getAllClients);
router.get('/view', getAllClients);

// /api/clients/view/:id or /api/clients/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || id === 'view') {
            return getAllClients(req, res);
        }

        let query = supabase.from('clients').select('*');
        if (!isNaN(Number(id))) {
            query = query.or(`id.eq.${id},government_id.eq.${id}`);
        } else {
            query = query.eq('government_id', String(id));
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
            console.error('Supabase SELECT single client error:', error);
            res.status(500).json({
                success: false,
                message: 'Database Error while fetching client details.'
            });
            return;
        }

        if (!data) {
            res.status(404).json({
                success: false,
                message: 'Client not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: decodeClient(data)
        });

    } catch (error: any) {
        console.error('Unexpected error fetching client details:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while fetching client details.'
        });
    }
});

export default router;