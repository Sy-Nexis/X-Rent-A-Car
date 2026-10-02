#!/usr/bin/env bash
# ==============================================================================
# AWS DynamoDB: Create staff Table with idx_staff_email GSI
# ==============================================================================

set -e

TABLE_NAME="staff"
REGION="${AWS_REGION:-us-east-1}"

echo "Creating DynamoDB table '${TABLE_NAME}' in region '${REGION}'..."

aws dynamodb create-table \
    --cli-input-json file://dynamodb_staff_schema.json \
    --region "${REGION}"

echo "Table '${TABLE_NAME}' creation initiated with primary key 'id' (Number) and GSI 'idx_staff_email' (String)."
echo "Waiting for table to become ACTIVE..."

aws dynamodb wait table-exists --table-name "${TABLE_NAME}" --region "${REGION}"

echo "Table '${TABLE_NAME}' is now ACTIVE and ready."
