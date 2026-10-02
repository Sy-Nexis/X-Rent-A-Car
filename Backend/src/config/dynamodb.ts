import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';

const clientConfig: any = {
    region,
};

// If explicit AWS credentials are provided in .env, use them
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    clientConfig.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
}

// Support DynamoDB Local endpoint if specified (e.g. for offline dev)
if (process.env.DYNAMODB_ENDPOINT) {
    clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
}

export const rawDynamoClient = new DynamoDBClient(clientConfig);
export const dynamoClient = rawDynamoClient;

export const dynamoDocClient = DynamoDBDocumentClient.from(rawDynamoClient, {
    marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    },
    unmarshallOptions: {
        wrapNumbers: false,
    },
});

export const STAFF_TABLE_NAME = process.env.DYNAMODB_STAFF_TABLE || 'staff';
export const STAFF_EMAIL_GSI_NAME = 'idx_staff_email';

export const VEHICLES_TABLE_NAME = process.env.DYNAMODB_VEHICLES_TABLE || 'vehicles';
export const VEHICLES_VIN_GSI = 'idx_vehicles_vin';
export const VEHICLES_PLATE_GSI = 'idx_vehicles_plate';

export const CLIENTS_TABLE_NAME = process.env.DYNAMODB_CLIENTS_TABLE || 'clients';
export const CLIENTS_GOVID_GSI = 'idx_clients_govid';
export const CLIENTS_EMAIL_GSI = 'idx_clients_email';

export const ASSIGNMENTS_TABLE_NAME = process.env.DYNAMODB_ASSIGNMENTS_TABLE || 'vehicle_assignments';
export const ASSIGNMENTS_CLIENT_GSI = 'idx_va_client_id';
export const ASSIGNMENTS_VEHICLE_GSI = 'idx_va_vehicle_id';

export const AUDIT_LOGS_TABLE_NAME = process.env.DYNAMODB_LOGS_TABLE || 'audit_logs';

