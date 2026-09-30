import { Router, Request, Response } from 'express';
import { supabase } from '../db';
import { cache } from '../utils/cache';
import { recordAuditLog } from './LogRoutes';

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

        let deleteQuery = supabase.from('clients').delete();

        if (id) {
            deleteQuery = deleteQuery.eq('id', id);
        } else if (government_id) {
            deleteQuery = deleteQuery.eq('government_id', String(government_id));
        } else if (nic) {
            deleteQuery = deleteQuery.eq('government_id', String(nic));
        } else if (email) {
            deleteQuery = deleteQuery.eq('email', String(email));
        }

        const { data, error } = await deleteQuery.select();

        if (error) {
            console.error('Supabase DELETE error:', error);
            res.status(500).json({
                success: false,
                message: 'Database Error while terminating client record.'
            });
            return;
        }

        if (!data || data.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No client found matching the provided identifier.'
            });
            return;
        }

        const deletedClient = data[0];
        const clientName = deletedClient
            ? `${deletedClient.first_name || ''} ${deletedClient.last_name || ''}`.trim() || deletedClient.email || deletedClient.government_id
            : `Client #${id || government_id || nic}`;

        recordAuditLog({
            userName: (req.headers['x-user-name'] as string) || (req.query.user_name as string) || 'Alex Rivera',
            userRole: (req.headers['x-user-role'] as string) || (req.query.user_role as string) || 'Fleet Manager',
            action: 'Deleted Client',
            entityType: 'Client',
            entityId: id ? String(id) : (deletedClient?.id ? String(deletedClient.id) : undefined),
            details: `Deleted client record for ${clientName} (${deletedClient?.government_id || deletedClient?.email || 'No ID'}).`
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