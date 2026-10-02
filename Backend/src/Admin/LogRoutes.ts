import { Router, Request, Response } from 'express';
import {
    getAllLogs as fetchDynamoLogs,
    recordAuditLog,
    clearAllLogs
} from '../services/dynamoLogService';
import { cache } from '../utils/cache';
import { getReqUserInfo } from '../utils/authUtils';

const router = Router();

export { recordAuditLog };

// ==========================================
// 1. GET ALL ACTIVITY LOGS
// ==========================================
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { user, action, entity, search, limit = '100' } = req.query;
        const cacheKey = `logs:list:${user || ''}:${action || ''}:${entity || ''}:${search || ''}:${limit}`;

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

        const results = await fetchDynamoLogs({
            user: user ? String(user) : undefined,
            action: action ? String(action) : undefined,
            entity: entity ? String(entity) : undefined,
            search: search ? String(search) : undefined,
            limit: Number(limit) || 100,
        });

        cache.set(cacheKey, results, 10000);

        res.setHeader('X-Cache', 'MISS');
        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (err: any) {
        console.warn('Notice fetching logs from DynamoDB:', err?.message || err);
        res.status(200).json({
            success: true,
            count: 0,
            data: []
        });
    }
});


// ==========================================
// 2. RECORD A LOG ENTRY (Client or API)
// ==========================================
router.post('/record', async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            user_name, userName,
            user_role, userRole,
            user_email, userEmail,
            action,
            entity_type, entityType,
            entity_id, entityId,
            details
        } = req.body;

        if (!action || !details) {
            res.status(400).json({
                success: false,
                message: 'Action and details are required to log an activity.'
            });
            return;
        }

        const userInfo = getReqUserInfo(req);

        const logged = await recordAuditLog({
            userName: userInfo.userName,
            userRole: userInfo.userRole,
            userEmail: userInfo.userEmail,
            action: action,
            entityType: entity_type || entityType || 'System',
            entityId: entity_id || entityId,
            details: details,
            ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1'
        });

        cache.invalidate('logs');

        res.status(201).json({
            success: true,
            message: 'Activity log recorded successfully.',
            data: logged
        });
    } catch (err: any) {
        console.error('Error creating activity log:', err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error while recording activity log.'
        });
    }
});

// ==========================================
// 3. CLEAR ACTIVITY LOGS
// ==========================================
router.delete('/clear', async (req: Request, res: Response): Promise<void> => {
    try {
        await clearAllLogs();
        cache.invalidate('logs');

        res.status(200).json({
            success: true,
            message: 'Activity logs cleared successfully.'
        });
    } catch (err: any) {
        console.error('Error clearing logs:', err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error while clearing activity logs.'
        });
    }
});

export default router;

