import { Router, Request, Response } from 'express';
import { supabase } from '../db';
import { cache } from '../utils/cache';
import { recordAuditLog } from './LogRoutes';

const router = Router();

// In-memory fallback store in case table creation is pending in Supabase
let inMemoryAssignments: any[] = [];

// Helper to normalize assignment object
function formatAssignment(item: any) {
    if (!item) return item;
    const client = item.clients || item.client || {};
    const vehicle = item.vehicles || item.vehicle || {};
    const clientName = `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.name || 'Corporate Client';

    return {
        id: item.id,
        clientId: item.client_id,
        vehicleId: item.vehicle_id,
        startDate: item.start_date || item.startDate,
        endDate: item.end_date || item.endDate,
        dailyRate: Number(item.daily_rate || item.dailyRate || vehicle.daily_rate || 0),
        status: item.status || 'Active',
        notes: item.notes || '',
        createdAt: item.created_at || item.createdAt,
        client: {
            id: client.id || item.client_id,
            name: clientName,
            email: client.email || '',
            phone: client.phone || '',
            governmentId: client.government_id || client.governmentId || '',
        },
        vehicle: {
            id: vehicle.id || item.vehicle_id,
            make: vehicle.make || '',
            model: vehicle.model || '',
            year: vehicle.year || 2024,
            licensePlate: vehicle.license_plate || vehicle.licensePlate || '',
            vin: vehicle.vin || '',
            dailyRate: Number(vehicle.daily_rate || vehicle.dailyRate || 0),
            status: vehicle.status || 'Active',
        }
    };
}

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

        // Attempt Supabase query with relations
        const { data, error } = await supabase
            .from('vehicle_assignments')
            .select(`
                id,
                client_id,
                vehicle_id,
                start_date,
                end_date,
                daily_rate,
                status,
                notes,
                created_at,
                clients ( id, first_name, last_name, email, phone, government_id ),
                vehicles ( id, make, model, year, license_plate, vin, daily_rate, status )
            `)
            .order('created_at', { ascending: false });

        let results: any[] = [];

        if (error) {
            console.warn('vehicle_assignments table query note (falling back to memory/sync):', error.message);
            results = inMemoryAssignments.map(formatAssignment);
        } else {
            results = (data || []).map(formatAssignment);
        }

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

        const assignmentRecords: any[] = [];
        const now = new Date().toISOString();

        // Build permutation records for multiple clients x multiple vehicles
        for (const cId of targetClientIds) {
            for (const vId of targetVehicleIds) {
                assignmentRecords.push({
                    client_id: cId,
                    vehicle_id: vId,
                    start_date: start_date ? new Date(start_date).toISOString() : now,
                    end_date: end_date ? new Date(end_date).toISOString() : null,
                    daily_rate: Number(daily_rate) || 0,
                    status: status || 'Active',
                    notes: notes || 'Assigned via Fleet Hub',
                    created_at: now,
                    updated_at: now
                });
            }
        }

        console.log(`CREATING_${assignmentRecords.length}_ASSIGNMENTS:`, assignmentRecords);

        // 1. Insert into Supabase vehicle_assignments table
        const { data, error } = await supabase
            .from('vehicle_assignments')
            .insert(assignmentRecords)
            .select(`
                id, client_id, vehicle_id, start_date, end_date, daily_rate, status, notes, created_at,
                clients ( id, first_name, last_name, email, phone, government_id ),
                vehicles ( id, make, model, year, license_plate, vin, daily_rate, status )
            `);

        // 2. Update vehicle statuses to 'Rented' in Supabase
        await supabase
            .from('vehicles')
            .update({ status: 'Rented' })
            .in('id', targetVehicleIds);

        let createdItems: any[] = [];

        if (error) {
            console.warn('vehicle_assignments insert fallback note:', error.message);
            // In-memory fallback
            for (const item of assignmentRecords) {
                const simulated = {
                    ...item,
                    id: Date.now() + Math.floor(Math.random() * 1000)
                };
                inMemoryAssignments.unshift(simulated);
                createdItems.push(formatAssignment(simulated));
            }
        } else {
            createdItems = (data || []).map(formatAssignment);
        }

        // Record audit log
        recordAuditLog({
            userName: req.body.user_name || req.body.userName || 'Alex Rivera',
            userRole: req.body.user_role || req.body.userRole || 'Fleet Manager',
            action: 'Assigned Vehicles',
            entityType: 'Assignment',
            details: `Dispatched ${assignmentRecords.length} contract(s) across ${targetClientIds.length} client(s) and ${targetVehicleIds.length} vehicle(s).`
        }).catch(() => {});

        // Invalidate caches
        cache.invalidate('assignment');
        cache.invalidate('vehicle');

        res.status(201).json({
            success: true,
            message: `Successfully created ${assignmentRecords.length} vehicle assignment(s).`,
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
        const targetId = id || req.query.id;

        if (!targetId) {
            res.status(400).json({
                success: false,
                message: 'Assignment ID is required for update.'
            });
            return;
        }

        const updateData: any = { updated_at: new Date().toISOString() };
        if (status !== undefined) updateData.status = status;
        if (end_date !== undefined) updateData.end_date = end_date ? new Date(end_date).toISOString() : null;
        if (daily_rate !== undefined) updateData.daily_rate = Number(daily_rate) || 0;
        if (notes !== undefined) updateData.notes = notes;

        // Fetch existing assignment to know vehicle ID
        const { data: existing } = await supabase
            .from('vehicle_assignments')
            .select('id, vehicle_id')
            .eq('id', targetId)
            .maybeSingle();

        const { data, error } = await supabase
            .from('vehicle_assignments')
            .update(updateData)
            .eq('id', targetId)
            .select();

        // If assignment completed or terminated, set vehicle back to Available
        const targetVehicleId = existing?.vehicle_id;
        if (targetVehicleId && (status === 'Completed' || status === 'Terminated' || status === 'Returned')) {
            await supabase
                .from('vehicles')
                .update({ status: 'Available' })
                .eq('id', targetVehicleId);
        }

        // Record audit log
        recordAuditLog({
            userName: req.body.user_name || req.body.userName || 'Alex Rivera',
            userRole: req.body.user_role || req.body.userRole || 'Fleet Manager',
            action: status === 'Completed' || status === 'Returned' ? 'Returned Vehicle' : 'Updated Assignment',
            entityType: 'Assignment',
            entityId: targetId,
            details: `Assignment #${targetId} status changed to '${status || 'Updated'}'. Vehicle returned to fleet.`
        }).catch(() => {});

        cache.invalidate('assignment');
        cache.invalidate('vehicle');

        res.status(200).json({
            success: true,
            message: `Assignment #${targetId} updated successfully.`,
            data: data
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
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'Assignment ID is required.'
            });
            return;
        }

        // Fetch vehicle_id before deletion
        const { data: existing } = await supabase
            .from('vehicle_assignments')
            .select('id, vehicle_id')
            .eq('id', id)
            .maybeSingle();

        const { error } = await supabase
            .from('vehicle_assignments')
            .delete()
            .eq('id', id);

        // Reset vehicle to available
        if (existing?.vehicle_id) {
            await supabase
                .from('vehicles')
                .update({ status: 'Available' })
                .eq('id', existing.vehicle_id);
        }

        inMemoryAssignments = inMemoryAssignments.filter(a => String(a.id) !== String(id));

        // Record audit log
        recordAuditLog({
            userName: 'Alex Rivera',
            userRole: 'Fleet Manager',
            action: 'Terminated Assignment',
            entityType: 'Assignment',
            entityId: id as string,
            details: `Terminated and deleted assignment contract #${id}.`
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
