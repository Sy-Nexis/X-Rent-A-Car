import { Router, Request, Response } from 'express';
import {
    createClient,
    updateClient,
    getClientById,
    getClientByGovId,
    getClientByEmail
} from '../services/dynamoClientService';
import { recordAuditLog } from '../services/dynamoLogService';
import { cache } from '../utils/cache';

const router = Router();

// /api/clients/add
router.post('/add', async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            first_name, last_name, email, phone, address,
            city, state, zip_code, government_id, license_number, status
        } = req.body;

        if (!first_name || !last_name) {
            res.status(400).json({
                success: false,
                message: 'First name and Last name are required.'
            });
            return;
        }

        // 1. Pre-flight Unique Government ID check via GSI
        if (government_id) {
            const existingGov = await getClientByGovId(String(government_id));
            if (existingGov) {
                res.status(400).json({
                    success: false,
                    message: `A client with Government ID "${government_id}" is already registered.`
                });
                return;
            }
        }

        // 2. Pre-flight Unique Email check via GSI
        if (email) {
            const existingEmail = await getClientByEmail(String(email));
            if (existingEmail) {
                res.status(400).json({
                    success: false,
                    message: `A client with email address "${email}" is already registered.`
                });
                return;
            }
        }

        // 3. Persist client in DynamoDB
        const created = await createClient({
            first_name,
            last_name,
            email,
            phone,
            address,
            city,
            state,
            zip_code,
            government_id,
            license_number,
            status: status || 'Active'
        });

        cache.invalidate('client');

        const clientFullName = `${first_name || ''} ${last_name || ''}`.trim() || 'New Client';
        recordAuditLog({
            userName: (req.headers['x-user-name'] as string) || req.body.user_name || req.body.userName || 'Staff User',
            userRole: (req.headers['x-user-role'] as string) || req.body.user_role || req.body.userRole || 'Staff',
            action: 'Registered Client',
            entityType: 'Client',
            entityId: created.id,
            details: `Registered client ${clientFullName} (${government_id || email || 'No ID'}).`
        }).catch(() => {});

        res.status(201).json({
            success: true,
            message: 'Client successfully registered to the DB.',
            data: [created]
        });

    } catch (error: any) {
        console.error('Unexpected error inserting client:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while saving client data.'
        });
    }
});

// /api/clients/update
router.put('/update', async (req: Request, res: Response): Promise<void> => {
    try {
        const { government, government_id, id, nic, email: queryEmail } = req.query;
        const targetGovId = government || government_id || nic || req.body.government_id || req.body.governmentId;
        const targetId = id || req.body.id;
        const targetEmail = queryEmail || req.body.email;

        console.log(`UPDATE client request received - GovID: ${targetGovId}, ID: ${targetId}, Email: ${targetEmail}`);

        if (!targetGovId && !targetId && !targetEmail) {
            res.status(400).json({
                success: false,
                message: 'Please provide the client identifier (government_id, id, or email)'
            });
            return;
        }

        // 1. Locate existing client record by ID, government_id, or email
        let existingClient = null;
        if (targetId && !isNaN(Number(targetId))) {
            existingClient = await getClientById(Number(targetId));
        }
        if (!existingClient && targetGovId) {
            existingClient = await getClientByGovId(String(targetGovId));
        }
        if (!existingClient && targetEmail) {
            existingClient = await getClientByEmail(String(targetEmail));
        }

        if (!existingClient) {
            res.status(404).json({
                success: false,
                message: 'No client found matching the provided identifier.'
            });
            return;
        }

        // 2. Normalize incoming fields (support snake_case and camelCase)
        const {
            first_name, firstName,
            last_name, lastName,
            name,
            email, phone, address,
            city, state,
            zip_code, zipCode,
            license_number, licenseNumber,
            status
        } = req.body;

        let derivedFirstName = first_name || firstName;
        let derivedLastName = last_name || lastName;

        if (!derivedFirstName && name && typeof name === 'string') {
            const parts = name.trim().split(' ');
            derivedFirstName = parts[0];
            derivedLastName = parts.slice(1).join(' ') || '';
        }

        const updateData: any = {};
        if (derivedFirstName !== undefined) updateData.first_name = String(derivedFirstName);
        if (derivedLastName !== undefined) updateData.last_name = String(derivedLastName);
        if (email !== undefined) updateData.email = String(email);
        if (phone !== undefined) updateData.phone = String(phone);
        if (address !== undefined) updateData.address = String(address);
        if (city !== undefined) updateData.city = String(city);
        if (state !== undefined) updateData.state = String(state);
        if (zip_code !== undefined || zipCode !== undefined) updateData.zip_code = String(zip_code || zipCode);
        if (license_number !== undefined || licenseNumber !== undefined) updateData.license_number = String(license_number || licenseNumber);
        if (status !== undefined) updateData.status = String(status);

        console.log("EXECUTING_CLIENT_UPDATE:", { id: existingClient.id, updateData });

        // 3. Execute update on verified client ID in DynamoDB
        const updated = await updateClient(existingClient.id, updateData);

        if (!updated) {
            res.status(404).json({
                success: false,
                message: 'Failed to apply update to client record.'
            });
            return;
        }

        // Invalidate client cache immediately
        cache.invalidate('client');

        const clientFullName = `${updated.first_name || ''} ${updated.last_name || ''}`.trim() || 'Client';

        // Compute exact fields that ACTUALLY changed
        const changedDiffs: string[] = [];

        function checkFieldDiff(label: string, oldVal: any, newVal: any) {
            if (newVal === undefined) return;
            const strOld = (oldVal === null || oldVal === undefined) ? '' : String(oldVal).trim();
            const strNew = (newVal === null || newVal === undefined) ? '' : String(newVal).trim();
            if (strOld.toLowerCase() !== strNew.toLowerCase()) {
                changedDiffs.push(`${label}: "${strOld || 'None'}" → "${strNew || 'None'}"`);
            }
        }

        checkFieldDiff('First Name', existingClient.first_name, updateData.first_name);
        checkFieldDiff('Last Name', existingClient.last_name, updateData.last_name);
        checkFieldDiff('Email', existingClient.email, updateData.email);
        checkFieldDiff('Phone', existingClient.phone, updateData.phone);
        checkFieldDiff('Address', existingClient.address, updateData.address);
        checkFieldDiff('City', existingClient.city, updateData.city);
        checkFieldDiff('State', existingClient.state, updateData.state);
        checkFieldDiff('ZIP', existingClient.zip_code, updateData.zip_code);
        checkFieldDiff('License', existingClient.license_number, updateData.license_number);
        checkFieldDiff('Status', existingClient.status, updateData.status);

        const changeDescription = changedDiffs.length > 0
            ? `Updated client ${clientFullName} (ID: ${existingClient.government_id || existingClient.id}). Changed: ${changedDiffs.join(', ')}.`
            : `Saved profile for ${clientFullName} with no field modifications.`;

        recordAuditLog({
            userName: (req.headers['x-user-name'] as string) || req.body.user_name || req.body.userName || 'Staff User',
            userRole: (req.headers['x-user-role'] as string) || req.body.user_role || req.body.userRole || 'Staff',
            action: 'Updated Client',
            entityType: 'Client',
            entityId: existingClient.id,
            details: changeDescription
        }).catch(() => {});

        res.status(200).json({
            success: true,
            message: `Client ${existingClient.first_name} ${existingClient.last_name} has been successfully updated.`,
            data: [updated]
        });

    } catch (error: any) {
        console.error('Unexpected error updating client:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error while attempting to update client data.'
        });
    }
});

export default router;