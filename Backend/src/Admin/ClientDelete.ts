import { Router, Request, Response } from 'express';
import { deleteClient } from '../services/dynamoClientService';
import { recordAuditLog } from '../services/dynamoLogService';
import { cache } from '../utils/cache';

const router = Router();

// /api/clients/del
router.delete('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { nic, id, government_id, email } = req.query;
        console.log(`DELETE client request received - NIC: ${nic}, ID: ${id}, GovID: ${government_id}`);

        if (!nic && !id && !government_id && !email) {
            res.status(400).json({
                success: false,
                message: 'At least one identifier ("nic", "government_id", "id", or "email") is required.'
            });
            return;
        }

        const targetId = id ? Number(id) : undefined;
        const targetGovId = (government_id || nic) ? String(government_id || nic) : undefined;
        const targetEmail = email ? String(email) : undefined;

        const deletedClient = await deleteClient(targetId, targetGovId, targetEmail);

        if (!deletedClient) {
            res.status(404).json({
                success: false,
                message: 'No client found matching the provided identifier.'
            });
            return;
        }

        const clientName = `${deletedClient.first_name || ''} ${deletedClient.last_name || ''}`.trim() || deletedClient.email || deletedClient.government_id;

        recordAuditLog({
            userName: (req.headers['x-user-name'] as string) || (req.query.user_name as string) || 'Staff User',
            userRole: (req.headers['x-user-role'] as string) || (req.query.user_role as string) || 'Staff',
            action: 'Deleted Client',
            entityType: 'Client',
            entityId: String(deletedClient.id),
            details: `Deleted client record for ${clientName} (${deletedClient.government_id || deletedClient.email || 'No ID'}).`
        }).catch(() => {});

        cache.invalidate('client');

        res.status(200).json({
            success: true,
            message: `Client record has been successfully removed from database.`
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