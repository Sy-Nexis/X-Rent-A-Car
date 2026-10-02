import {
    ScanCommand,
    PutCommand,
    DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import {
    dynamoDocClient,
    AUDIT_LOGS_TABLE_NAME
} from '../config/dynamodb';

export interface AuditLogItem {
    id: number;
    user_name: string;
    user_role: string;
    user_email?: string;
    action: string;
    entity_type: string;
    entity_id?: string | null;
    details: string;
    ip_address?: string;
    created_at: string;
}

let inMemoryLogs: AuditLogItem[] = [
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
    }
];

export async function getAllLogs(filters: {
    user?: string;
    action?: string;
    entity?: string;
    search?: string;
    limit?: number;
}): Promise<AuditLogItem[]> {
    let items: AuditLogItem[] = [];

    try {
        const command = new ScanCommand({
            TableName: AUDIT_LOGS_TABLE_NAME,
            Limit: filters.limit || 100,
        });
        const response = await dynamoDocClient.send(command);
        if (response.Items && response.Items.length > 0) {
            items = response.Items as AuditLogItem[];
        } else {
            items = inMemoryLogs;
        }
    } catch (err: any) {
        console.warn('DynamoDB getAllLogs fallback note:', err?.message);
        items = inMemoryLogs;
    }

    let results = [...items];

    if (filters.user) {
        const u = filters.user.toLowerCase();
        results = results.filter(l => (l.user_name || '').toLowerCase().includes(u));
    }
    if (filters.action) {
        const a = filters.action.toLowerCase();
        results = results.filter(l => (l.action || '').toLowerCase().includes(a));
    }
    if (filters.entity) {
        const e = filters.entity.toLowerCase();
        results = results.filter(l => (l.entity_type || '').toLowerCase().includes(e));
    }
    if (filters.search) {
        const q = filters.search.toLowerCase();
        results = results.filter(l =>
            (l.user_name || '').toLowerCase().includes(q) ||
            (l.action || '').toLowerCase().includes(q) ||
            (l.details || '').toLowerCase().includes(q) ||
            (l.entity_type || '').toLowerCase().includes(q)
        );
    }

    return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function recordAuditLog(log: {
    userName?: string;
    userRole?: string;
    userEmail?: string;
    action: string;
    entityType: string;
    entityId?: string | number;
    details: string;
    ipAddress?: string;
}): Promise<AuditLogItem> {
    const numericId = Date.now() + Math.floor(Math.random() * 1000);
    const now = new Date().toISOString();

    const entry: AuditLogItem = {
        id: numericId,
        user_name: log.userName || 'Alex Rivera',
        user_role: log.userRole || 'Fleet Manager',
        user_email: log.userEmail || '',
        action: log.action,
        entity_type: log.entityType,
        entity_id: log.entityId ? String(log.entityId) : null,
        details: log.details,
        ip_address: log.ipAddress || '127.0.0.1',
        created_at: now,
    };

    inMemoryLogs.unshift(entry);

    try {
        const command = new PutCommand({
            TableName: AUDIT_LOGS_TABLE_NAME,
            Item: entry,
        });
        await dynamoDocClient.send(command);
    } catch (err: any) {
        console.warn('DynamoDB recordAuditLog note:', err?.message);
    }

    return entry;
}

export async function clearAllLogs(): Promise<boolean> {
    inMemoryLogs = [];
    return true;
}
