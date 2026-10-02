import {
    ScanCommand,
    GetCommand,
    PutCommand,
    DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import {
    dynamoDocClient,
    ASSIGNMENTS_TABLE_NAME,
} from '../config/dynamodb';
import { getClientById } from './dynamoClientService';
import { getVehicleById, updateVehicle } from './dynamoVehicleService';

export interface AssignmentItem {
    id: number | string;
    client_id: number | string;
    vehicle_id: number | string;
    start_date: string;
    end_date?: string | null;
    daily_rate: number;
    status: string; // 'Active', 'Completed', 'Terminated'
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

// Helper to format assignment with joined client and vehicle objects
export async function formatAssignmentJoined(item: any): Promise<any> {
    if (!item) return item;

    const [client, vehicle] = await Promise.all([
        getClientById(item.client_id || item.clientId),
        getVehicleById(item.vehicle_id || item.vehicleId)
    ]);

    const clientName = client ? `${client.first_name || ''} ${client.last_name || ''}`.trim() : 'Corporate Client';

    return {
        id: isNaN(Number(item.id)) ? item.id : Number(item.id),
        clientId: item.client_id || item.clientId,
        vehicleId: item.vehicle_id || item.vehicleId,
        startDate: item.start_date || item.startDate,
        endDate: item.end_date || item.endDate,
        dailyRate: Number(item.daily_rate || item.dailyRate || vehicle?.daily_rate || 0),
        status: item.status || 'Active',
        notes: item.notes || '',
        createdAt: item.created_at || item.createdAt,
        client: {
            id: client?.id || item.client_id,
            name: clientName,
            email: client?.email || '',
            phone: client?.phone || '',
            governmentId: client?.government_id || '',
        },
        vehicle: {
            id: vehicle?.id || item.vehicle_id,
            make: vehicle?.make || '',
            model: vehicle?.model || '',
            year: vehicle?.year || 2024,
            licensePlate: vehicle?.license_plate || '',
            vin: vehicle?.vin || '',
            dailyRate: Number(vehicle?.daily_rate || 0),
            status: vehicle?.status || 'Active',
        }
    };
}

export async function getAllAssignments(): Promise<any[]> {
    try {
        const command = new ScanCommand({
            TableName: ASSIGNMENTS_TABLE_NAME,
        });
        const response = await dynamoDocClient.send(command);
        let items: any[] = [];
        if (response.Items && response.Items.length > 0) {
            items = response.Items;
        }

        const joined = await Promise.all(items.map(formatAssignmentJoined));
        return joined.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } catch (error: any) {
        console.warn('DynamoDB getAllAssignments notice:', error?.message || error);
        return [];
    }
}

export async function getAssignmentById(id: number | string): Promise<AssignmentItem | null> {
    try {
        const command = new GetCommand({
            TableName: ASSIGNMENTS_TABLE_NAME,
            Key: { id: String(id) },
        });
        const response = await dynamoDocClient.send(command);
        if (response.Item) return response.Item as AssignmentItem;
        return null;
    } catch (error: any) {
        console.warn('DynamoDB getAssignmentById notice:', error?.message || error);
        return null;
    }
}

export async function createBatchAssignments(params: {
    client_ids: (number | string)[];
    vehicle_ids: (number | string)[];
    start_date?: string;
    end_date?: string;
    daily_rate?: number;
    notes?: string;
    status?: string;
}): Promise<any[]> {
    const { client_ids, vehicle_ids, start_date, end_date, daily_rate, notes, status } = params;
    const now = new Date().toISOString();
    const createdItems: any[] = [];

    for (const cId of client_ids) {
        for (const vId of vehicle_ids) {
            const rawId = String(Date.now() + Math.floor(Math.random() * 10000));
            const item: any = {
                id: rawId,
                client_id: String(cId),
                vehicle_id: String(vId),
                start_date: start_date ? new Date(start_date).toISOString() : now,
                end_date: end_date ? new Date(end_date).toISOString() : null,
                daily_rate: Number(daily_rate) || 0,
                status: status || 'Active',
                notes: notes || 'Assigned via Fleet Workstation',
                created_at: now,
                updated_at: now,
            };

            const command = new PutCommand({
                TableName: ASSIGNMENTS_TABLE_NAME,
                Item: item,
            });
            await dynamoDocClient.send(command);

            // Update vehicle status in DynamoDB to 'Rented'
            await updateVehicle(vId, { status: 'Rented' });

            const formatted = await formatAssignmentJoined(item);
            createdItems.push(formatted);
        }
    }

    return createdItems;
}

export async function updateAssignment(id: number | string, updateData: Partial<AssignmentItem>): Promise<any | null> {
    const existing = await getAssignmentById(id);
    if (!existing) return null;

    const merged: any = {
        ...existing,
        ...updateData,
        id: String(existing.id),
        updated_at: new Date().toISOString(),
    };

    const command = new PutCommand({
        TableName: ASSIGNMENTS_TABLE_NAME,
        Item: merged,
    });
    await dynamoDocClient.send(command);

    // If status completed/returned, reset vehicle to Available
    const newStatus = updateData.status || existing.status;
    if (newStatus === 'Completed' || newStatus === 'Terminated' || newStatus === 'Returned') {
        await updateVehicle(existing.vehicle_id, { status: 'Available' });
    }

    return await formatAssignmentJoined(merged);
}

export async function deleteAssignment(id: number | string): Promise<boolean> {
    const existing = await getAssignmentById(id);

    const command = new DeleteCommand({
        TableName: ASSIGNMENTS_TABLE_NAME,
        Key: { id: String(id) },
    });
    await dynamoDocClient.send(command);

    if (existing?.vehicle_id) {
        await updateVehicle(existing.vehicle_id, { status: 'Available' });
    }

    return true;
}


