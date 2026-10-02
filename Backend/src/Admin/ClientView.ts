import { Router, Request, Response } from 'express';
import { getAllClients as fetchDynamoClients, getClientById, getClientByGovId } from '../services/dynamoClientService';
import { cache } from '../utils/cache';

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
        const cacheKey = 'clients:all';
        const cached = cache.get<any[]>(cacheKey);
        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            res.status(200).json({
                success: true,
                count: cached.length,
                data: cached
            });
            return;
        }

        const data = await fetchDynamoClients();
        const decodedData = data ? data.map(decodeClient) : [];
        cache.set(cacheKey, decodedData, 30000); // 30s TTL

        res.setHeader('X-Cache', 'MISS');
        res.status(200).json({
            success: true,
            count: decodedData.length,
            data: decodedData
        });

    } catch (error: any) {
        console.warn('Notice fetching clients from DynamoDB:', error?.message || error);

        res.status(200).json({
            success: true,
            count: 0,
            data: []
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

        const cacheKey = `client:${id}`;
        const cached = cache.get<any>(cacheKey);
        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            res.status(200).json({
                success: true,
                data: cached
            });
            return;
        }

        let data = null;
        if (!isNaN(Number(id))) {
            data = await getClientById(Number(id));
        }
        if (!data) {
            data = await getClientByGovId(String(id));
        }

        if (!data) {
            res.status(404).json({
                success: false,
                message: 'Client not found'
            });
            return;
        }

        const decoded = decodeClient(data);
        cache.set(cacheKey, decoded, 30000);

        res.setHeader('X-Cache', 'MISS');
        res.status(200).json({
            success: true,
            data: decoded
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