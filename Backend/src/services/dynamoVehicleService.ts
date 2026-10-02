import {
    ScanCommand,
    GetCommand,
    QueryCommand,
    PutCommand,
    UpdateCommand,
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

// In-memory local fallback store for seamless offline/hybrid dev
let inMemoryVehicles: VehicleItem[] = [
    {
        id: 1,
        make: "Toyota",
        model: "Prius",
        year: 2023,
        vin: "JTDKN3DU5F1234567",
        license_plate: "WP-CAB-1234",
        transmission: "Automatic",
        fuel_type: "Hybrid",
        engine_capacity: "1800cc",
        color: "Pearl White",
        mileage: 18500,
        daily_rate: 18500,
        branch: "Colombo Central",
        status: "Available",
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        make: "Toyota",
        model: "Land Cruiser Prado",
        year: 2024,
        vin: "JTEBX3FJ8K7654321",
        license_plate: "WP-CBA-9988",
        transmission: "Automatic",
        fuel_type: "Diesel",
        engine_capacity: "2800cc",
        color: "Attitude Black",
        mileage: 8200,
        daily_rate: 45000,
        branch: "Colombo Central",
        status: "Available",
        created_at: new Date().toISOString()
    }
];

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
        return inMemoryVehicles.map(decodeVehicle);
    } catch (error: any) {
        console.warn('DynamoDB getAllVehicles fallback note:', error?.message);
        return inMemoryVehicles.map(decodeVehicle);
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

        const memory = inMemoryVehicles.find(v => Number(v.id) === Number(id));
        return memory ? decodeVehicle(memory) : null;
    } catch (error: any) {
        const memory = inMemoryVehicles.find(v => Number(v.id) === Number(id));
        return memory ? decodeVehicle(memory) : null;
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
        const memory = inMemoryVehicles.find(v => v.vin.toLowerCase() === normalizedVin.toLowerCase());
        return memory ? decodeVehicle(memory) : null;
    } catch {
        const memory = inMemoryVehicles.find(v => v.vin.toLowerCase() === normalizedVin.toLowerCase());
        return memory ? decodeVehicle(memory) : null;
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
        const memory = inMemoryVehicles.find(v => v.license_plate.toLowerCase() === normalizedPlate.toLowerCase());
        return memory ? decodeVehicle(memory) : null;
    } catch {
        const memory = inMemoryVehicles.find(v => v.license_plate.toLowerCase() === normalizedPlate.toLowerCase());
        return memory ? decodeVehicle(memory) : null;
    }
}

export async function createVehicle(data: Partial<VehicleItem>): Promise<VehicleItem> {
    const numericId = data.id || Date.now() + Math.floor(Math.random() * 1000);
    const now = new Date().toISOString();

    const newVehicle: VehicleItem = {
        id: numericId,
        make: String(data.make || ''),
        model: String(data.model || ''),
        year: Number(data.year) || new Date().getFullYear(),
        vin: String(data.vin || ''),
        license_plate: String(data.license_plate || ''),
        transmission: String(data.transmission || 'Automatic'),
        fuel_type: String(data.fuel_type || 'Petrol'),
        engine_capacity: String(data.engine_capacity || ''),
        color: String(data.color || ''),
        mileage: Number(data.mileage) || 0,
        daily_rate: Number(data.daily_rate) || 0,
        branch: String(data.branch || 'Main'),
        status: String(data.status || 'Available'),
        created_at: now,
        updated_at: now,
    };

    inMemoryVehicles.unshift(newVehicle);

    try {
        const command = new PutCommand({
            TableName: VEHICLES_TABLE_NAME,
            Item: newVehicle,
            ConditionExpression: 'attribute_not_exists(id)',
        });
        await dynamoDocClient.send(command);
    } catch (err: any) {
        console.warn('DynamoDB createVehicle note:', err?.message);
    }

    return decodeVehicle(newVehicle);
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

    // Update in-memory
    const idx = inMemoryVehicles.findIndex(v => Number(v.id) === targetId);
    if (idx >= 0) inMemoryVehicles[idx] = merged;

    try {
        const command = new PutCommand({
            TableName: VEHICLES_TABLE_NAME,
            Item: merged,
        });
        await dynamoDocClient.send(command);
    } catch (err: any) {
        console.warn('DynamoDB updateVehicle note:', err?.message);
    }

    return decodeVehicle(merged);
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

    inMemoryVehicles = inMemoryVehicles.filter(v => Number(v.id) !== Number(targetVehicle!.id));

    try {
        const command = new DeleteCommand({
            TableName: VEHICLES_TABLE_NAME,
            Key: { id: Number(targetVehicle.id) },
        });
        await dynamoDocClient.send(command);
    } catch (err: any) {
        console.warn('DynamoDB deleteVehicle note:', err?.message);
    }

    return targetVehicle;
}
