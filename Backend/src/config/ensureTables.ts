import {
    CreateTableCommand,
    DescribeTableCommand,
    ListTablesCommand,
    TableStatus
} from '@aws-sdk/client-dynamodb';
import {
    rawDynamoClient,
    STAFF_TABLE_NAME,
    STAFF_EMAIL_GSI_NAME,
    VEHICLES_TABLE_NAME,
    VEHICLES_VIN_GSI,
    VEHICLES_PLATE_GSI,
    CLIENTS_TABLE_NAME,
    CLIENTS_GOVID_GSI,
    CLIENTS_EMAIL_GSI,
    ASSIGNMENTS_TABLE_NAME,
    ASSIGNMENTS_CLIENT_GSI,
    ASSIGNMENTS_VEHICLE_GSI,
    AUDIT_LOGS_TABLE_NAME
} from './dynamodb';

interface TableDefinition {
    tableName: string;
    createParams: any;
}

const tableDefinitions: TableDefinition[] = [
    // 1. Base Table: staff with idx_staff_email GSI
    {
        tableName: STAFF_TABLE_NAME,
        createParams: {
            TableName: STAFF_TABLE_NAME,
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' }
            ],
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'N' },
                { AttributeName: 'email', AttributeType: 'S' }
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: STAFF_EMAIL_GSI_NAME,
                    KeySchema: [
                        { AttributeName: 'email', KeyType: 'HASH' }
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    }
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    },
    // 2. Base Table: vehicles with idx_vehicles_vin & idx_vehicles_plate GSIs
    {
        tableName: VEHICLES_TABLE_NAME,
        createParams: {
            TableName: VEHICLES_TABLE_NAME,
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' }
            ],
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'N' },
                { AttributeName: 'vin', AttributeType: 'S' },
                { AttributeName: 'license_plate', AttributeType: 'S' }
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: VEHICLES_VIN_GSI,
                    KeySchema: [
                        { AttributeName: 'vin', KeyType: 'HASH' }
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    }
                },
                {
                    IndexName: VEHICLES_PLATE_GSI,
                    KeySchema: [
                        { AttributeName: 'license_plate', KeyType: 'HASH' }
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    }
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    },
    // 3. Base Table: clients with idx_clients_govid & idx_clients_email GSIs
    {
        tableName: CLIENTS_TABLE_NAME,
        createParams: {
            TableName: CLIENTS_TABLE_NAME,
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' }
            ],
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'N' },
                { AttributeName: 'government_id', AttributeType: 'S' },
                { AttributeName: 'email', AttributeType: 'S' }
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: CLIENTS_GOVID_GSI,
                    KeySchema: [
                        { AttributeName: 'government_id', KeyType: 'HASH' }
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    }
                },
                {
                    IndexName: CLIENTS_EMAIL_GSI,
                    KeySchema: [
                        { AttributeName: 'email', KeyType: 'HASH' }
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    }
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    },
    // 4. Base Table: vehicle_assignments with idx_va_client_id & idx_va_vehicle_id GSIs
    {
        tableName: ASSIGNMENTS_TABLE_NAME,
        createParams: {
            TableName: ASSIGNMENTS_TABLE_NAME,
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' }
            ],
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'N' },
                { AttributeName: 'client_id', AttributeType: 'N' },
                { AttributeName: 'vehicle_id', AttributeType: 'N' }
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: ASSIGNMENTS_CLIENT_GSI,
                    KeySchema: [
                        { AttributeName: 'client_id', KeyType: 'HASH' }
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    }
                },
                {
                    IndexName: ASSIGNMENTS_VEHICLE_GSI,
                    KeySchema: [
                        { AttributeName: 'vehicle_id', KeyType: 'HASH' }
                    ],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    }
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    },
    // 5. Base Table: audit_logs
    {
        tableName: AUDIT_LOGS_TABLE_NAME,
        createParams: {
            TableName: AUDIT_LOGS_TABLE_NAME,
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' }
            ],
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'N' }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    }
];

export async function ensureAllDynamoTables(): Promise<void> {
    try {
        console.log("Checking DynamoDB tables in AWS account...");
        const listRes = await rawDynamoClient.send(new ListTablesCommand({}));
        const existingTables = new Set(listRes.TableNames || []);

        for (const def of tableDefinitions) {
            if (!existingTables.has(def.tableName)) {
                console.log(`[DynamoDB Auto-Provisioning] Table '${def.tableName}' missing in AWS. Creating...`);
                try {
                    await rawDynamoClient.send(new CreateTableCommand(def.createParams));
                    console.log(`[DynamoDB Auto-Provisioning] Creation initiated for '${def.tableName}'.`);
                } catch (createErr: any) {
                    if (createErr.name === 'ResourceInUseException') {
                        console.log(`Table '${def.tableName}' is already being created.`);
                    } else {
                        console.error(`Error creating table '${def.tableName}':`, createErr.message || createErr);
                    }
                }
            } else {
                console.log(`[DynamoDB] Table '${def.tableName}' exists in AWS.`);
            }
        }
    } catch (err: any) {
        console.warn("Notice checking/auto-provisioning DynamoDB tables:", err.message || err);
    }
}
