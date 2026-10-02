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
