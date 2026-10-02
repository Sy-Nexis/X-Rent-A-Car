import {
    ScanCommand,
    GetCommand,
    QueryCommand,
    PutCommand,
    DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import {
    dynamoDocClient,
    CLIENTS_TABLE_NAME,
    CLIENTS_GOVID_GSI,
    CLIENTS_EMAIL_GSI
} from '../config/dynamodb';

export interface ClientItem {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    government_id: string;
    license_number?: string;
    status: string;
    created_at?: string;
    updated_at?: string;
}

let inMemoryClients: ClientItem[] = [
    {
        id: 1,
        first_name: "John",
        last_name: "Perera",
        email: "john.perera@example.com",
        phone: "+94 77 123 4567",
        address: "45 Galle Road",
        city: "Colombo",
        state: "Western Province",
        zip_code: "00300",
        government_id: "921543210V",
        license_number: "B9215432",
        status: "Active",
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        first_name: "Sara",
        last_name: "Fernando",
        email: "sara.f@globalcorporate.lk",
        phone: "+94 71 987 6543",
        address: "12 Bauddhaloka Mawatha",
        city: "Colombo",
        state: "Western Province",
        zip_code: "00700",
        government_id: "958765432V",
        license_number: "B9587654",
        status: "Active",
        created_at: new Date().toISOString()
    }
];

export async function getAllClients(): Promise<ClientItem[]> {
    try {
        const command = new ScanCommand({
            TableName: CLIENTS_TABLE_NAME,
        });
        const response = await dynamoDocClient.send(command);
        if (response.Items && response.Items.length > 0) {
            return response.Items as ClientItem[];
        }
        return inMemoryClients;
    } catch (error: any) {
        console.warn('DynamoDB getAllClients fallback note:', error?.message);
        return inMemoryClients;
    }
}

export async function getClientById(id: number): Promise<ClientItem | null> {
    try {
        const command = new GetCommand({
            TableName: CLIENTS_TABLE_NAME,
            Key: { id: Number(id) },
        });
        const response = await dynamoDocClient.send(command);
        if (response.Item) return response.Item as ClientItem;

        const memory = inMemoryClients.find(c => Number(c.id) === Number(id));
        return memory || null;
    } catch {
        const memory = inMemoryClients.find(c => Number(c.id) === Number(id));
        return memory || null;
    }
}

export async function getClientByGovId(govId: string): Promise<ClientItem | null> {
    const normalizedGovId = String(govId).trim();
    try {
        const command = new QueryCommand({
            TableName: CLIENTS_TABLE_NAME,
            IndexName: CLIENTS_GOVID_GSI,
            KeyConditionExpression: 'government_id = :govId',
            ExpressionAttributeValues: { ':govId': normalizedGovId },
            Limit: 1,
        });
        const response = await dynamoDocClient.send(command);
        if (response.Items && response.Items.length > 0) {
            return response.Items[0] as ClientItem;
        }
        const memory = inMemoryClients.find(c => c.government_id.toLowerCase() === normalizedGovId.toLowerCase());
        return memory || null;
    } catch {
        const memory = inMemoryClients.find(c => c.government_id.toLowerCase() === normalizedGovId.toLowerCase());
        return memory || null;
    }
}

export async function getClientByEmail(email: string): Promise<ClientItem | null> {
    const normalizedEmail = String(email).trim().toLowerCase();
    try {
        const command = new QueryCommand({
            TableName: CLIENTS_TABLE_NAME,
            IndexName: CLIENTS_EMAIL_GSI,
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': normalizedEmail },
            Limit: 1,
        });
        const response = await dynamoDocClient.send(command);
        if (response.Items && response.Items.length > 0) {
            return response.Items[0] as ClientItem;
        }
        const memory = inMemoryClients.find(c => c.email.toLowerCase() === normalizedEmail);
        return memory || null;
    } catch {
        const memory = inMemoryClients.find(c => c.email.toLowerCase() === normalizedEmail);
        return memory || null;
    }
}

export async function createClient(data: Partial<ClientItem>): Promise<ClientItem> {
    const numericId = data.id || Date.now() + Math.floor(Math.random() * 1000);
    const now = new Date().toISOString();

    const newClient: ClientItem = {
        id: numericId,
        first_name: String(data.first_name || '').trim(),
        last_name: String(data.last_name || '').trim(),
        email: String(data.email || '').trim().toLowerCase(),
        phone: String(data.phone || '').trim(),
        address: data.address ? String(data.address).trim() : undefined,
        city: data.city ? String(data.city).trim() : undefined,
        state: data.state ? String(data.state).trim() : undefined,
        zip_code: data.zip_code ? String(data.zip_code).trim() : undefined,
        government_id: String(data.government_id || '').trim(),
        license_number: data.license_number ? String(data.license_number).trim() : undefined,
        status: String(data.status || 'Active'),
        created_at: now,
        updated_at: now,
    };

    inMemoryClients.unshift(newClient);

    try {
        const command = new PutCommand({
            TableName: CLIENTS_TABLE_NAME,
            Item: newClient,
            ConditionExpression: 'attribute_not_exists(id)',
        });
        await dynamoDocClient.send(command);
    } catch (err: any) {
        console.warn('DynamoDB createClient note:', err?.message);
    }

    return newClient;
}

export async function updateClient(id: number, updateData: Partial<ClientItem>): Promise<ClientItem | null> {
    const targetId = Number(id);
    const existing = await getClientById(targetId);
    if (!existing) return null;

    const merged: ClientItem = {
        ...existing,
        ...updateData,
        id: targetId,
        updated_at: new Date().toISOString(),
    };

    const idx = inMemoryClients.findIndex(c => Number(c.id) === targetId);
    if (idx >= 0) inMemoryClients[idx] = merged;

    try {
        const command = new PutCommand({
            TableName: CLIENTS_TABLE_NAME,
            Item: merged,
        });
        await dynamoDocClient.send(command);
    } catch (err: any) {
        console.warn('DynamoDB updateClient note:', err?.message);
    }

    return merged;
}

export async function deleteClient(id?: number, govId?: string, email?: string): Promise<ClientItem | null> {
    let targetClient: ClientItem | null = null;
    if (id) {
        targetClient = await getClientById(id);
    } else if (govId) {
        targetClient = await getClientByGovId(govId);
    } else if (email) {
        targetClient = await getClientByEmail(email);
    }

    if (!targetClient) return null;

    inMemoryClients = inMemoryClients.filter(c => Number(c.id) !== Number(targetClient!.id));

    try {
        const command = new DeleteCommand({
            TableName: CLIENTS_TABLE_NAME,
            Key: { id: Number(targetClient.id) },
        });
        await dynamoDocClient.send(command);
    } catch (err: any) {
        console.warn('DynamoDB deleteClient note:', err?.message);
    }

    return targetClient;
}
