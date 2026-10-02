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

export async function getAllClients(): Promise<ClientItem[]> {
    try {
        const command = new ScanCommand({
            TableName: CLIENTS_TABLE_NAME,
        });
        const response = await dynamoDocClient.send(command);
        if (response.Items && response.Items.length > 0) {
            return response.Items as ClientItem[];
        }
        return [];
    } catch (error: any) {
        console.warn('DynamoDB getAllClients notice:', error?.message || error);
        return [];
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
        return null;
    } catch (error: any) {
        console.warn('DynamoDB getClientById notice:', error?.message || error);
        return null;
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
        return null;
    } catch (error: any) {
        console.warn('DynamoDB getClientByGovId notice:', error?.message || error);
        return null;
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
        return null;
    } catch (error: any) {
        console.warn('DynamoDB getClientByEmail notice:', error?.message || error);
        return null;
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

    try {
        const command = new PutCommand({
            TableName: CLIENTS_TABLE_NAME,
            Item: newClient,
            ConditionExpression: 'attribute_not_exists(id)',
        });
        await dynamoDocClient.send(command);
        return newClient;
    } catch (err: any) {
        console.error('DynamoDB createClient error:', err);
        throw err;
    }
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

    try {
        const command = new PutCommand({
            TableName: CLIENTS_TABLE_NAME,
            Item: merged,
        });
        await dynamoDocClient.send(command);
        return merged;
    } catch (err: any) {
        console.error('DynamoDB updateClient error:', err);
        throw err;
    }
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

    try {
        const command = new DeleteCommand({
            TableName: CLIENTS_TABLE_NAME,
            Key: { id: Number(targetClient.id) },
        });
        await dynamoDocClient.send(command);
        return targetClient;
    } catch (err: any) {
        console.error('DynamoDB deleteClient error:', err);
        throw err;
    }
}

