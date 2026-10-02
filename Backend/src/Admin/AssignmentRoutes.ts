import { Router, Request, Response } from 'express';
import {
    getAllAssignments as fetchDynamoAssignments,
    createBatchAssignments,
    updateAssignment as updateDynamoAssignment,
    deleteAssignment as deleteDynamoAssignment,
    getAssignmentById
} from '../services/dynamoAssignmentService';
import { recordAuditLog } from '../services/dynamoLogService';
import { cache } from '../utils/cache';

const router = Router();

// ==========================================
// 1. GET ALL ASSIGNMENTS
// ==========================================
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const cacheKey = 'assignments:all';
        const cached = cache.get<any[]>(cacheKey);
        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            res.status(200).json({
                success: true,
                count: cached.length,
                data: cached
            });
            return;
        }

        const results = await fetchDynamoAssignments();
        cache.set(cacheKey, results, 15000);

        res.setHeader('X-Cache', 'MISS');
        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });

    } catch (error: any) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error while fetching assignments.'
        });
    }
});

// ==========================================
// 2. ASSIGN MULTIPLE VEHICLES TO MULTIPLE CLIENTS
// ==========================================
router.post('/assign', async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            client_ids, client_id, clientIds,
            vehicle_ids, vehicle_id, vehicleIds,
            start_date, end_date, daily_rate, notes, status
        } = req.body;

        // Normalize arrays of IDs
        const rawClientIds: any[] = client_ids || clientIds || (client_id ? [client_id] : []);
        const rawVehicleIds: any[] = vehicle_ids || vehicleIds || (vehicle_id ? [vehicle_id] : []);

        const targetClientIds: number[] = Array.isArray(rawClientIds)
            ? rawClientIds.map(Number).filter(n => !isNaN(n) && n > 0)
            : [];

        const targetVehicleIds: number[] = Array.isArray(rawVehicleIds)
            ? rawVehicleIds.map(Number).filter(n => !isNaN(n) && n > 0)
            : [];

        if (targetClientIds.length === 0 || targetVehicleIds.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Please select at least one Client and at least one Vehicle to create assignment(s).'
            });
            return;
        }

        // Persist batch assignments to DynamoDB and update vehicle statuses
        const createdItems = await createBatchAssignments({
            client_ids: targetClientIds,
            vehicle_ids: targetVehicleIds,
            start_date,
            end_date,
            daily_rate: Number(daily_rate) || 0,
            notes,
            status: status || 'Active'
        });

        // Record detailed audit log with specific client & vehicle names
        const clientNames = Array.from(new Set(createdItems.map(i => i.client?.name).filter(Boolean))).join(', ');
        const vehicleNames = Array.from(new Set(createdItems.map(i => `${i.vehicle?.make} ${i.vehicle?.model} (${i.vehicle?.licensePlate || 'N/A'})`).filter(Boolean))).join(', ');

        recordAuditLog({
            userName: (req.headers['x-user-name'] as string) || req.body.user_name || req.body.userName || 'Alex Rivera',
            userRole: (req.headers['x-user-role'] as string) || req.body.user_role || req.body.userRole || 'Fleet Manager',
            action: 'Assigned Vehicles to Clients',
            entityType: 'Assignment',
            details: `Assigned ${targetVehicleIds.length} vehicle(s) [${vehicleNames || targetVehicleIds.join(', ')}] to ${targetClientIds.length} client(s) [${clientNames || targetClientIds.join(', ')}]. Daily Rate: LKR ${Number(daily_rate || 0).toLocaleString()}.`
        }).catch(() => {});

        // Invalidate caches
        cache.invalidate('assignment');
        cache.invalidate('vehicle');

        res.status(201).json({
            success: true,
            message: `Successfully created ${createdItems.length} vehicle assignment(s).`,
            count: createdItems.length,
            data: createdItems
        });

    } catch (error: any) {
        console.error('Error creating assignments:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error while creating assignments.',
            detail: error.message
        });
    }
});

// ==========================================
// 3. UPDATE ASSIGNMENT (Complete, Terminate, Status)
// ==========================================
router.put('/update', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, status, end_date, daily_rate, notes } = req.body;
        const targetId = Number(id || req.query.id);

        if (!targetId || isNaN(targetId)) {
            res.status(400).json({
                success: false,
                message: 'Valid assignment ID is required for update.'
            });
            return;
        }

        const existing = await getAssignmentById(targetId);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: `Assignment #${targetId} not found.`
            });
            return;
        }

        const updateData: any = {};
        if (status !== undefined) updateData.status = status;
        if (end_date !== undefined) updateData.end_date = end_date ? new Date(end_date).toISOString() : null;
        if (daily_rate !== undefined) updateData.daily_rate = Number(daily_rate) || 0;
        if (notes !== undefined) updateData.notes = notes;

        const updated = await updateDynamoAssignment(targetId, updateData);

        const isReturn = status === 'Completed' || status === 'Returned';
        let detailMsg = '';
        if (isReturn) {
            detailMsg = `Returned vehicle from contract #${targetId}. Status marked as ${status}. Vehicle status reset to Available.`;
        } else {
            const assignDiffs: string[] = [];
            if (status !== undefined && status !== existing.status) assignDiffs.push(`Status: ${existing.status || 'Active'} → ${status}`);
            if (daily_rate !== undefined && Number(daily_rate) !== Number(existing.daily_rate)) assignDiffs.push(`Rate: LKR ${Number(existing.daily_rate || 0).toLocaleString()} → LKR ${Number(daily_rate).toLocaleString()}`);
            if (notes !== undefined && notes !== existing.notes) assignDiffs.push(`Notes: "${notes}"`);
            detailMsg = assignDiffs.length > 0
                ? `Updated contract #${targetId}. Changes: ${assignDiffs.join(', ')}.`
                : `Saved contract #${targetId} settings.`;
        }

        // Record audit log
        recordAuditLog({
            userName: (req.headers['x-user-name'] as string) || req.body.user_name || req.body.userName || 'Alex Rivera',
            userRole: (req.headers['x-user-role'] as string) || req.body.user_role || req.body.userRole || 'Fleet Manager',
            action: isReturn ? 'Returned Vehicle' : 'Updated Assignment',
            entityType: 'Assignment',
            entityId: targetId,
            details: detailMsg
        }).catch(() => {});

        cache.invalidate('assignment');
        cache.invalidate('vehicle');

        res.status(200).json({
            success: true,
            message: `Assignment #${targetId} updated successfully.`,
            data: updated ? [updated] : []
        });

    } catch (error: any) {
        console.error('Error updating assignment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error while updating assignment.'
        });
    }
});

// ==========================================
// 4. DELETE / TERMINATE ASSIGNMENT
// ==========================================
router.delete('/del', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query;
        if (!id || isNaN(Number(id))) {
            res.status(400).json({
                success: false,
                message: 'Assignment ID is required.'
            });
            return;
        }

        await deleteDynamoAssignment(Number(id));

        // Record audit log
        recordAuditLog({
            userName: (req.headers['x-user-name'] as string) || (req.query.user_name as string) || 'Alex Rivera',
            userRole: (req.headers['x-user-role'] as string) || (req.query.user_role as string) || 'Fleet Manager',
            action: 'Terminated Assignment',
            entityType: 'Assignment',
            entityId: String(id),
            details: `Terminated and deleted assignment contract #${id}. Vehicle status reset to Available.`
        }).catch(() => {});

        cache.invalidate('assignment');
        cache.invalidate('vehicle');

        res.status(200).json({
            success: true,
            message: `Assignment #${id} removed and vehicle returned to available fleet.`
        });

    } catch (error: any) {
        console.error('Error deleting assignment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error while deleting assignment.'
        });
    }
});

export default router;
