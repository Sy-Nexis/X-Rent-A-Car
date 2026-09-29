import { Router, Request, Response } from 'express';
import { supabase } from '../db';
import { cache } from '../utils/cache';

const router = Router();

// In-memory fallback logs store
let inMemoryLogs: any[] = [
    {
        id: 1,
        user_name: 'Alex Rivera',
        user_role: 'Fleet Manager',
        user_email: 'alex.rivera@fleetcontrol.io',
        action: 'Login',
        entity_type: 'Auth',
        entity_id: 'USR-01',
        details: 'User authenticated successfully to neXus Fleet Control System.',
        ip_address: '127.0.0.1',
        created_at: new Date(Date.now() - 3 * 3600000).toISOString()
    },
    {
        id: 2,
        user_name: 'Alex Rivera',
        user_role: 'Fleet Manager',
        user_email: 'alex.rivera@fleetcontrol.io',
        action: 'Assigned Vehicles',
        entity_type: 'Assignment',
        entity_id: 'ASN-101',
        details: 'Dispatched multi-vehicle contract across corporate fleet units.',
        ip_address: '127.0.0.1',
        created_at: new Date(Date.now() - 2 * 3600000).toISOString()
    },
    {
        id: 3,
        user_name: 'Alex Rivera',
        user_role: 'Fleet Manager',
        user_email: 'alex.rivera@fleetcontrol.io',
        action: 'Registered Vehicle',
        entity_type: 'Vehicle',
        entity_id: 'VEH-88',
        details: 'Added new Toyota Land Cruiser Prado (CAB-4455) to active fleet.',
        ip_address: '127.0.0.1',
        created_at: new Date(Date.now() - 45 * 60000).toISOString()
    },
    {
        id: 4,
        user_name: 'Alex Rivera',
        user_role: 'Fleet Manager',
        user_email: 'alex.rivera@fleetcontrol.io',
        action: 'Updated Client',
        entity_type: 'Client',
        entity_id: 'CLI-12',
        details: 'Updated verified contact and business details for Corporate Client.',
        ip_address: '127.0.0.1',
        created_at: new Date(Date.now() - 15 * 60000).toISOString()
    }
];

// Helper export to record logs from any backend service
export async function recordAuditLog(log: {
    userName?: string;
    userRole?: string;
    userEmail?: string;
    action: string;
    entityType: string;
    entityId?: string | number;
    details: string;
    ipAddress?: string;
}) {
    const entry = {
        user_name: log.userName || 'System User',
        user_role: log.userRole || 'Fleet Manager',
        user_email: log.userEmail || '',
        action: log.action,
        entity_type: log.entityType,
        entity_id: log.entityId ? String(log.entityId) : null,
        details: log.details,
        ip_address: log.ipAddress || '127.0.0.1',
        created_at: new Date().toISOString()
    };

    // 1. Memory insert
    inMemoryLogs.unshift({ ...entry, id: Date.now() });

    // 2. Supabase insert
    try {
        await supabase.from('audit_logs').insert([entry]);
    } catch (err: any) {
        console.warn('audit_logs supabase insert note:', err?.message);
    }

    cache.invalidate('logs');
}

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

        // Try Supabase first
        let query = supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(Number(limit) || 100);

        if (user) query = query.ilike('user_name', `%${user}%`);
        if (action) query = query.ilike('action', `%${action}%`);
        if (entity) query = query.ilike('entity_type', `%${entity}%`);

        const { data, error } = await query;

        let results = [];
        if (error || !data || data.length === 0) {
            // Use inMemory fallback
            results = [...inMemoryLogs];
            if (user) results = results.filter(l => l.user_name.toLowerCase().includes(String(user).toLowerCase()));
            if (action) results = results.filter(l => l.action.toLowerCase().includes(String(action).toLowerCase()));
            if (entity) results = results.filter(l => l.entity_type.toLowerCase().includes(String(entity).toLowerCase()));
            if (search) {
                const q = String(search).toLowerCase();
                results = results.filter(l =>
                    l.user_name.toLowerCase().includes(q) ||
                    l.action.toLowerCase().includes(q) ||
                    l.details.toLowerCase().includes(q) ||
                    l.entity_type.toLowerCase().includes(q)
                );
            }
        } else {
            results = data;
            if (search) {
                const q = String(search).toLowerCase();
                results = results.filter(l =>
                    (l.user_name || '').toLowerCase().includes(q) ||
                    (l.action || '').toLowerCase().includes(q) ||
                    (l.details || '').toLowerCase().includes(q) ||
                    (l.entity_type || '').toLowerCase().includes(q)
                );
            }
        }

        cache.set(cacheKey, results, 10000);

        res.setHeader('X-Cache', 'MISS');
        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (err: any) {
        console.error('Error fetching logs:', err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error while retrieving activity logs.'
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

        const logEntry = {
            user_name: user_name || userName || 'Alex Rivera',
            user_role: user_role || userRole || 'Fleet Manager',
            user_email: user_email || userEmail || '',
            action: action,
            entity_type: entity_type || entityType || 'System',
            entity_id: entity_id || entityId ? String(entity_id || entityId) : null,
            details: details,
            ip_address: req.ip || req.socket.remoteAddress || '127.0.0.1',
            created_at: new Date().toISOString()
        };

        // In-memory
        const memoryRecord = { ...logEntry, id: Date.now() };
        inMemoryLogs.unshift(memoryRecord);

        // Supabase
        const { data, error } = await supabase
            .from('audit_logs')
            .insert([logEntry])
            .select();

        cache.invalidate('logs');

        res.status(201).json({
            success: true,
            message: 'Activity log recorded successfully.',
            data: data && data.length > 0 ? data[0] : memoryRecord
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
        inMemoryLogs = [];
        await supabase.from('audit_logs').delete().neq('id', 0);
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
