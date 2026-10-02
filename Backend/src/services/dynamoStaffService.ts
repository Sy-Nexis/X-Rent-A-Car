import {
    QueryCommand,
    GetCommand,
    PutCommand,
    UpdateCommand,
    ScanCommand
} from '@aws-sdk/lib-dynamodb';
import { dynamoDocClient, STAFF_TABLE_NAME, STAFF_EMAIL_GSI_NAME } from '../config/dynamodb';

export interface StaffItem {
    id: number; // Partition key (Number)
    email: string; // GSI partition key (String)
    first_name: string;
    last_name: string;
    password_hash: string;
    role: string;
    status: string;
    created_at?: string;
    last_login?: string;
}

/**
 * 1. Find a staff member by email using the Global Secondary Index (idx_staff_email)
 */
export async function getStaffByEmail(email: string): Promise<StaffItem | null> {
    const normalizedEmail = String(email).trim().toLowerCase();

    try {
        const command = new QueryCommand({
            TableName: STAFF_TABLE_NAME,
            IndexName: STAFF_EMAIL_GSI_NAME,
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': normalizedEmail,
            },
            Limit: 1,
        });

        const response = await dynamoDocClient.send(command);

        if (response.Items && response.Items.length > 0) {
            return response.Items[0] as StaffItem;
        }

        return null;
    } catch (error: any) {
        console.error('DynamoDB getStaffByEmail error:', error);
        throw error;
    }
}

/**
 * 2. Find a staff member by numeric primary key (id)
 */
export async function getStaffById(id: number): Promise<StaffItem | null> {
    try {
        const command = new GetCommand({
            TableName: STAFF_TABLE_NAME,
            Key: {
                id: Number(id),
            },
        });

        const response = await dynamoDocClient.send(command);
        return (response.Item as StaffItem) || null;
    } catch (error: any) {
        console.error('DynamoDB getStaffById error:', error);
        throw error;
    }
}

/**
 * 3. Save a new staff member with Application-Level Unique Email Constraint enforcement
 *
 * DynamoDB does not support native unique constraints on secondary indexes.
 * Before saving, we query idx_staff_email to ensure no other user has this email.
 */
export async function createStaff(params: {
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    role?: string;
    status?: string;
    id?: number;
}): Promise<StaffItem> {
    const normalizedEmail = String(params.email).trim().toLowerCase();

    // --- STEP 3 CONSTRAINT CHECK: Verify email uniqueness using GSI idx_staff_email ---
    const existingStaff = await getStaffByEmail(normalizedEmail);
    if (existingStaff) {
        const error: any = new Error(`DUPLICATE_EMAIL: A staff member with email '${normalizedEmail}' already exists.`);
        error.code = 'DUPLICATE_EMAIL';
        throw error;
    }

    // Generate unique numeric ID if not provided (matching SQL bigint type)
    const numericId = params.id || Date.now() + Math.floor(Math.random() * 1000);
    const now = new Date().toISOString();

    const newStaffItem: StaffItem = {
        id: numericId,
        email: normalizedEmail,
        first_name: String(params.first_name).trim(),
        last_name: String(params.last_name).trim(),
        password_hash: params.password_hash,
        role: params.role || 'Staff',
        status: params.status || 'Active',
        created_at: now,
        last_login: now,
    };

    try {
        const command = new PutCommand({
            TableName: STAFF_TABLE_NAME,
            Item: newStaffItem,
            // Prevent accidental overwriting of existing numeric primary key ID
            ConditionExpression: 'attribute_not_exists(id)',
        });

        await dynamoDocClient.send(command);
        console.log(`DYNAMODB_STAFF_CREATED: [ID: ${numericId}] Email: ${normalizedEmail}`);

        return newStaffItem;
    } catch (error: any) {
        console.error('DynamoDB createStaff error:', error);
        throw error;
    }
}

/**
 * 4. Update staff last_login timestamp in DynamoDB
 */
export async function updateStaffLastLogin(id: number): Promise<void> {
    try {
        const command = new UpdateCommand({
            TableName: STAFF_TABLE_NAME,
            Key: { id: Number(id) },
            UpdateExpression: 'SET last_login = :now',
            ExpressionAttributeValues: {
                ':now': new Date().toISOString(),
            },
        });

        await dynamoDocClient.send(command);
    } catch (error: any) {
        console.warn('DynamoDB updateStaffLastLogin warning:', error?.message);
    }
}

/**
 * 5. Update staff password hash in DynamoDB
 */
export async function updateStaffPassword(email: string, newPasswordHash: string): Promise<boolean> {
    const staff = await getStaffByEmail(email);
    if (!staff) return false;

    try {
        const command = new UpdateCommand({
            TableName: STAFF_TABLE_NAME,
            Key: { id: staff.id },
            UpdateExpression: 'SET password_hash = :hash',
            ExpressionAttributeValues: {
                ':hash': newPasswordHash,
            },
        });

        await dynamoDocClient.send(command);
        return true;
    } catch (error: any) {
        console.error('DynamoDB updateStaffPassword error:', error);
        throw error;
    }
}
