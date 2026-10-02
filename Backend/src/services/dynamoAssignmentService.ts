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
    id: number;
    client_id: number;
    vehicle_id: number;
    start_date: string;
    end_date?: string | null;
    daily_rate: number;
    status: string; // 'Active', 'Completed', 'Terminated'
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

let inMemoryAssignments: AssignmentItem[] = [];

// Helper to format assignment with joined client and vehicle objects
export async function formatAssignmentJoined(item: any): Promise<any> {
    if (!item) return item;

    const [client, vehicle] = await Promise.all([
        getClientById(Number(item.client_id || item.clientId)),
        getVehicleById(Number(item.vehicle_id || item.vehicleId))
    ]);

    const clientName = client ? `${client.first_name || ''} ${client.last_name || ''}`.trim() : 'Corporate Client';

    return {
        id: item.id,
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
            licensePlate: vehicle?.license_plate || vehicle?.licensePlate || '',
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
        } else {
            items = inMemoryAssignments;
        }

        const joined = await Promise.all(items.map(formatAssignmentJoined));
        return joined.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } catch (error: any) {
        console.warn('DynamoDB getAllAssignments fallback note:', error?.message);
        const joined = await Promise.all(inMemoryAssignments.map(formatAssignmentJoined));
        return joined.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
}

export async function getAssignmentById(id: number): Promise<AssignmentItem | null> {
    try {
        const command = new GetCommand({
            TableName: ASSIGNMENTS_TABLE_NAME,
            Key: { id: Number(id) },
        });
        const response = await dynamoDocClient.send(command);
        if (response.Item) return response.Item as AssignmentItem;

        const memory = inMemoryAssignments.find(a => Number(a.id) === Number(id));
        return memory || null;
    } catch {
        const memory = inMemoryAssignments.find(a => Number(a.id) === Number(id));
        return memory || null;
    }
}

export async function createBatchAssignments(params: {
    client_ids: number[];
    vehicle_ids: number[];
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
            const numericId = Date.now() + Math.floor(Math.random() * 10000);
            const item: AssignmentItem = {
                id: numericId,
                client_id: Number(cId),
                vehicle_id: Number(vId),
                start_date: start_date ? new Date(start_date).toISOString() : now,
                end_date: end_date ? new Date(end_date).toISOString() : null,
                daily_rate: Number(daily_rate) || 0,
                status: status || 'Active',
                notes: notes || 'Assigned via Fleet Workstation',
                created_at: now,
                updated_at: now,
            };

            inMemoryAssignments.unshift(item);

            try {
                const command = new PutCommand({
                    TableName: ASSIGNMENTS_TABLE_NAME,
                    Item: item,
                });
                await dynamoDocClient.send(command);
            } catch (err: any) {
                console.warn('DynamoDB createBatchAssignments note:', err?.message);
            }

            // Update vehicle status in DynamoDB to 'Rented'
            await updateVehicle(Number(vId), { status: 'Rented' });

            const formatted = await formatAssignmentJoined(item);
            createdItems.push(formatted);
        }
    }

    return createdItems;
}

export async function updateAssignment(id: number, updateData: Partial<AssignmentItem>): Promise<any | null> {
    const targetId = Number(id);
    const existing = await getAssignmentById(targetId);
    if (!existing) return null;

    const merged: AssignmentItem = {
        ...existing,
        ...updateData,
        id: targetId,
        updated_at: new Date().toISOString(),
    };

    const idx = inMemoryAssignments.findIndex(a => Number(a.id) === targetId);
    if (idx >= 0) inMemoryAssignments[idx] = merged;

    try {
        const command = new PutCommand({
            TableName: ASSIGNMENTS_TABLE_NAME,
            Item: merged,
        });
        await dynamoDocClient.send(command);
    } catch (err: any) {
        console.warn('DynamoDB updateAssignment note:', err?.message);
    }

    // If status completed/returned, reset vehicle to Available
    const newStatus = updateData.status || existing.status;
    if (newStatus === 'Completed' || newStatus === 'Terminated' || newStatus === 'Returned') {
        await updateVehicle(Number(existing.vehicle_id), { status: 'Available' });
    }

    return await formatAssignmentJoined(merged);
}

export async function deleteAssignment(id: number): Promise<boolean> {
    const targetId = Number(id);
    const existing = await getAssignmentById(targetId);

    inMemoryAssignments = inMemoryAssignments.filter(a => Number(a.id) !== targetId);

    try {
        const command = new DeleteCommand({
            TableName: ASSIGNMENTS_TABLE_NAME,
            Key: { id: targetId },
        });
        await dynamoDocClient.send(command);
    } catch (err: any) {
        console.warn('DynamoDB deleteAssignment note:', err?.message);
    }

    if (existing?.vehicle_id) {
        await updateVehicle(Number(existing.vehicle_id), { status: 'Available' });
    }

    return true;
}
