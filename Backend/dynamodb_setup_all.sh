#!/usr/bin/env bash
# ==============================================================================
# AWS DynamoDB: Create All 5 Tables with Free-Tier Capacity Settings
# Tables: staff, vehicles, clients, vehicle_assignments, audit_logs
# ==============================================================================

set -e

REGION="${AWS_REGION:-us-east-1}"

echo "=========================================================="
echo "Initializing DynamoDB Tables in Region: ${REGION}"
echo "=========================================================="

create_table_if_not_exists() {
    local table_name=$1
    local json_spec=$2

    echo -n "Checking if table '${table_name}' exists... "
    if aws dynamodb describe-table --table-name "${table_name}" --region "${REGION}" >/dev/null 2>&1; then
        echo "ALREADY EXISTS. Skipping."
    else
        echo "Creating '${table_name}'..."
        aws dynamodb create-table --cli-input-json "${json_spec}" --region "${REGION}"
        echo "Waiting for '${table_name}' to become ACTIVE..."
        aws dynamodb wait table-exists --table-name "${table_name}" --region "${REGION}"
        echo "Table '${table_name}' is ACTIVE."
    fi
}

# 1. Staff Table
create_table_if_not_exists "staff" '{
  "TableName": "staff",
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "N" },
    { "AttributeName": "email", "AttributeType": "S" }
  ],
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "ProvisionedThroughput": { "ReadCapacityUnits": 5, "WriteCapacityUnits": 5 },
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "idx_staff_email",
      "KeySchema": [{ "AttributeName": "email", "KeyType": "HASH" }],
      "Projection": { "ProjectionType": "ALL" },
      "ProvisionedThroughput": { "ReadCapacityUnits": 5, "WriteCapacityUnits": 5 }
    }
  ]
}'

# 2. Vehicles Table
create_table_if_not_exists "vehicles" '{
  "TableName": "vehicles",
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "N" },
    { "AttributeName": "vin", "AttributeType": "S" },
    { "AttributeName": "license_plate", "AttributeType": "S" }
  ],
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "ProvisionedThroughput": { "ReadCapacityUnits": 5, "WriteCapacityUnits": 5 },
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "idx_vehicles_vin",
      "KeySchema": [{ "AttributeName": "vin", "KeyType": "HASH" }],
      "Projection": { "ProjectionType": "ALL" },
      "ProvisionedThroughput": { "ReadCapacityUnits": 5, "WriteCapacityUnits": 5 }
    },
    {
      "IndexName": "idx_vehicles_plate",
      "KeySchema": [{ "AttributeName": "license_plate", "KeyType": "HASH" }],
      "Projection": { "ProjectionType": "ALL" },
      "ProvisionedThroughput": { "ReadCapacityUnits": 5, "WriteCapacityUnits": 5 }
    }
  ]
}'

# 3. Clients Table
create_table_if_not_exists "clients" '{
  "TableName": "clients",
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "N" },
    { "AttributeName": "government_id", "AttributeType": "S" },
    { "AttributeName": "email", "AttributeType": "S" }
  ],
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "ProvisionedThroughput": { "ReadCapacityUnits": 5, "WriteCapacityUnits": 5 },
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "idx_clients_govid",
      "KeySchema": [{ "AttributeName": "government_id", "KeyType": "HASH" }],
      "Projection": { "ProjectionType": "ALL" },
      "ProvisionedThroughput": { "ReadCapacityUnits": 5, "WriteCapacityUnits": 5 }
    },
    {
      "IndexName": "idx_clients_email",
      "KeySchema": [{ "AttributeName": "email", "KeyType": "HASH" }],
      "Projection": { "ProjectionType": "ALL" },
      "ProvisionedThroughput": { "ReadCapacityUnits": 5, "WriteCapacityUnits": 5 }
    }
  ]
}'

# 4. Vehicle Assignments Table
create_table_if_not_exists "vehicle_assignments" '{
  "TableName": "vehicle_assignments",
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "N" },
    { "AttributeName": "client_id", "AttributeType": "N" },
    { "AttributeName": "vehicle_id", "AttributeType": "N" }
  ],
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "ProvisionedThroughput": { "ReadCapacityUnits": 5, "WriteCapacityUnits": 5 },
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "idx_va_client_id",
      "KeySchema": [{ "AttributeName": "client_id", "KeyType": "HASH" }],
      "Projection": { "ProjectionType": "ALL" },
      "ProvisionedThroughput": { "ReadCapacityUnits": 5, "WriteCapacityUnits": 5 }
    },
    {
      "IndexName": "idx_va_vehicle_id",
      "KeySchema": [{ "AttributeName": "vehicle_id", "KeyType": "HASH" }],
      "Projection": { "ProjectionType": "ALL" },
      "ProvisionedThroughput": { "ReadCapacityUnits": 5, "WriteCapacityUnits": 5 }
    }
  ]
}'

# 5. Audit Logs Table
create_table_if_not_exists "audit_logs" '{
  "TableName": "audit_logs",
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "N" }
  ],
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "ProvisionedThroughput": { "ReadCapacityUnits": 5, "WriteCapacityUnits": 5 }
}'

echo "=========================================================="
echo "All 5 DynamoDB tables are verified and active!"
echo "=========================================================="
