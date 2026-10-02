import { Router, Request, Response } from 'express';
import { cache } from '../utils/cache';
import { getAllVehicles, getVehicleById, getVehicleByVin, getVehicleByPlate } from '../services/dynamoVehicleService';

const router = Router();

const getVehiclesList = async (req: Request, res: Response): Promise<void> => {
    try {
        const cacheKey = 'vehicles:all';
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

        const vehicles = await getAllVehicles();
        cache.set(cacheKey, vehicles, 15000);

        res.setHeader('X-Cache', 'MISS');
        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: vehicles
        });
    } catch (error: any) {
        console.warn('Notice fetching vehicles from DynamoDB:', error?.message || error);
        res.status(200).json({
            success: true,
            count: 0,
            data: []
        });
    }
};


const getSingleVehicle = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: paramId } = req.params;
        const { id: queryId, vin, plate, license_plate } = req.query;
        const targetId = paramId || queryId;

        if (targetId === 'view' || targetId === 'all') {
            return getVehiclesList(req, res);
        }

        let vehicle = null;

        if (targetId) {
            vehicle = await getVehicleById(String(targetId));
            if (!vehicle && !isNaN(Number(targetId))) {
                vehicle = await getVehicleById(Number(targetId));
            }
            if (!vehicle) {
                vehicle = await getVehicleByVin(String(targetId));
            }
            if (!vehicle) {
                vehicle = await getVehicleByPlate(String(targetId));
            }
        } else if (vin) {
            vehicle = await getVehicleByVin(String(vin));
        } else if (plate || license_plate) {
            vehicle = await getVehicleByPlate(String(plate || license_plate));
        }

        if (!vehicle) {
            res.status(404).json({
                success: false,
                message: 'No vehicle record found matching the search criteria.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: vehicle
        });
    } catch (error: any) {
        console.error('Error retrieving vehicle from DynamoDB:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while checking vehicle registry.'
        });
    }
};

router.get('/', getVehiclesList);
router.get('/all', getVehiclesList);
router.get('/view', getVehiclesList);
router.get('/search', getSingleVehicle);
router.get('/single', getSingleVehicle);
router.get('/:id', getSingleVehicle);

export default router;