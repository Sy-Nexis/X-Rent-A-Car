import {
    ScanCommand,
    GetCommand,
    QueryCommand,
    PutCommand,
    DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import {
    dynamoDocClient,
    VEHICLES_TABLE_NAME,
    VEHICLES_VIN_GSI,
    VEHICLES_PLATE_GSI
} from '../config/dynamodb';

export interface VehicleItem {
    id: number;
    make: string;
    model: string;
    year: number;
    vin: string;
    license_plate: string;
    transmission: string;
    fuel_type: string;
    engine_capacity?: string;
    color?: string;
    mileage: number;
    daily_rate: number;
    branch: string;
    status: string;
    created_at?: string;
    updated_at?: string;
}

export function decodeVehicle(vehicle: any): any {
    if (!vehicle) return vehicle;
    let status = vehicle.status;
    let branch = vehicle.branch;
    if (branch && branch.includes('|')) {
        const parts = branch.split('|');
        branch = parts[0];
        status = parts[1];
    } else if (status === 'Available') {
        status = 'Active';
    }

    const dailyRateNum = Number(vehicle.daily_rate) || Number(vehicle.dailyRate) || 0;
    const licensePlateStr = vehicle.license_plate || vehicle.licensePlate || '';

    return {
        ...vehicle,
        status,
        branch,
        licensePlate: licensePlateStr,
        license_plate: licensePlateStr,
        dailyRate: dailyRateNum,
        daily_rate: dailyRateNum,
        fuelType: vehicle.fuel_type || vehicle.fuelType || 'Petrol',
        fuel_type: vehicle.fuel_type || vehicle.fuelType || 'Petrol',
        engineCapacity: vehicle.engine_capacity || vehicle.engineCapacity || '',
        engine_capacity: vehicle.engine_capacity || vehicle.engineCapacity || '',
    };
}

export async function getAllVehicles(): Promise<VehicleItem[]> {
    try {
        const command = new ScanCommand({
            TableName: VEHICLES_TABLE_NAME,
        });
        const response = await dynamoDocClient.send(command);
        if (response.Items && response.Items.length > 0) {
            return (response.Items as VehicleItem[]).map(decodeVehicle);
        }
        return [];
    } catch (error: any) {
        console.warn('DynamoDB getAllVehicles notice:', error?.message || error);
        return [];
    }
}

export async function getVehicleById(id: number): Promise<VehicleItem | null> {
    try {
        const command = new GetCommand({
            TableName: VEHICLES_TABLE_NAME,
            Key: { id: Number(id) },
        });
        const response = await dynamoDocClient.send(command);
        if (response.Item) return decodeVehicle(response.Item);
        return null;
    } catch (error: any) {
        console.warn('DynamoDB getVehicleById notice:', error?.message || error);
        return null;
    }
}

export async function getVehicleByVin(vin: string): Promise<VehicleItem | null> {
    const normalizedVin = String(vin).trim();
    try {
        const command = new QueryCommand({
            TableName: VEHICLES_TABLE_NAME,
            IndexName: VEHICLES_VIN_GSI,
            KeyConditionExpression: 'vin = :vin',
            ExpressionAttributeValues: { ':vin': normalizedVin },
            Limit: 1,
        });
        const response = await dynamoDocClient.send(command);
        if (response.Items && response.Items.length > 0) {
            return decodeVehicle(response.Items[0]);
        }
        return null;
    } catch (error: any) {
        console.warn('DynamoDB getVehicleByVin notice:', error?.message || error);
        return null;
    }
}

export async function getVehicleByPlate(plate: string): Promise<VehicleItem | null> {
    const normalizedPlate = String(plate).trim();
    try {
        const command = new QueryCommand({
            TableName: VEHICLES_TABLE_NAME,
            IndexName: VEHICLES_PLATE_GSI,
            KeyConditionExpression: 'license_plate = :plate',
            ExpressionAttributeValues: { ':plate': normalizedPlate },
            Limit: 1,
        });
        const response = await dynamoDocClient.send(command);
        if (response.Items && response.Items.length > 0) {
            return decodeVehicle(response.Items[0]);
        }
        return null;
    } catch (error: any) {
        console.warn('DynamoDB getVehicleByPlate notice:', error?.message || error);
        return null;
    }
}


export async function createVehicle(data: Partial<VehicleItem>): Promise<VehicleItem> {
    const numericId = data.id || Date.now() + Math.floor(Math.random() * 1000);
    const now = new Date().toISOString();

    const newVehicle: VehicleItem = {
        id: numericId,
        make: String(data.make || '').trim(),
        model: String(data.model || '').trim(),
        year: Number(data.year) || new Date().getFullYear(),
        vin: String(data.vin || '').trim(),
        license_plate: String(data.license_plate || '').trim(),
        transmission: String(data.transmission || 'Automatic').trim(),
        fuel_type: String(data.fuel_type || 'Petrol').trim(),
        engine_capacity: data.engine_capacity ? String(data.engine_capacity).trim() : undefined,
        color: data.color ? String(data.color).trim() : undefined,
        mileage: Number(data.mileage) || 0,
        daily_rate: Number(data.daily_rate) || 0,
        branch: String(data.branch || 'Main').trim(),
        status: String(data.status || 'Available').trim(),
        created_at: now,
        updated_at: now,
    };

    try {
        const command = new PutCommand({
            TableName: VEHICLES_TABLE_NAME,
            Item: newVehicle,
            ConditionExpression: 'attribute_not_exists(id)',
        });
        await dynamoDocClient.send(command);
        return decodeVehicle(newVehicle);
    } catch (err: any) {
        console.error('DynamoDB createVehicle error:', err);
        throw err;
    }
}

export async function updateVehicle(id: number, updateData: Partial<VehicleItem>): Promise<VehicleItem | null> {
    const targetId = Number(id);
    const existing = await getVehicleById(targetId);
    if (!existing) return null;

    const merged: VehicleItem = {
        ...existing,
        ...updateData,
        id: targetId,
        updated_at: new Date().toISOString()
    };

    try {
        const command = new PutCommand({
            TableName: VEHICLES_TABLE_NAME,
            Item: merged,
        });
        await dynamoDocClient.send(command);
        return decodeVehicle(merged);
    } catch (err: any) {
        console.error('DynamoDB updateVehicle error:', err);
        throw err;
    }
}

export async function deleteVehicle(id?: number, vin?: string, plate?: string): Promise<VehicleItem | null> {
    let targetVehicle: VehicleItem | null = null;
    if (id) {
        targetVehicle = await getVehicleById(id);
    } else if (vin) {
        targetVehicle = await getVehicleByVin(vin);
    } else if (plate) {
        targetVehicle = await getVehicleByPlate(plate);
    }

    if (!targetVehicle) return null;

    try {
        const command = new DeleteCommand({
            TableName: VEHICLES_TABLE_NAME,
            Key: { id: Number(targetVehicle.id) },
        });
        await dynamoDocClient.send(command);
        return targetVehicle;
    } catch (err: any) {
        console.error('DynamoDB deleteVehicle error:', err);
        throw err;
    }
}

