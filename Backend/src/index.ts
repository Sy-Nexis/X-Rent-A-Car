import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vehicleInputRouter from './Admin/VehicleInput';
import vehicleViwRouter from './Admin/VehicleView';
import vehicleDeleteRouter from './Admin/VehicleDelete';
import clientInputRouter from './Admin/ClientInput';
import clientViwRouter from './Admin/ClientView';
import clientDeleteRouter from './Admin/ClientDelete';
import assignmentRouter from './Admin/AssignmentRoutes';
import logRouter from './Admin/LogRoutes';
import authRoutes from './routes/authRoutes';
import { dynamoClient, STAFF_TABLE_NAME } from './config/dynamodb';
import { DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { ensureAllDynamoTables } from './config/ensureTables';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8801;

// Global Middleware
app.use(cors()); // Allow cross-origin requests from the Frontend
app.use(express.json()); // Parse incoming JSON payloads

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Mounting Routing Layers
app.use('/api/auth', authRoutes);

// Admin Routes (Vehicles & Clients)
app.use('/api/vehicles', vehicleViwRouter);
app.use('/api/vehicles', vehicleInputRouter);
app.use('/api/vehicles/view', vehicleViwRouter);
app.use('/api/vehicles/del', vehicleDeleteRouter);

app.use('/api/clients', clientViwRouter);
app.use('/api/clients', clientInputRouter);
app.use('/api/clients/view', clientViwRouter);
app.use('/api/clients/del', clientDeleteRouter);

// Vehicle to Client Assignments
app.use('/api/assignments', assignmentRouter);
app.use('/api/assignments/view', assignmentRouter);

// Activity Logs
app.use('/api/logs', logRouter);
app.use('/api/logs/view', logRouter);

// Health system monitoring endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: "Active", database: "AWS DynamoDB" });
});

// Initialize and Start Server
app.listen(PORT, async () => {
    console.log(`neXus API Server running on http://localhost:${PORT}`);

    // Auto-verify and create any missing tables in user's AWS DynamoDB account
    await ensureAllDynamoTables();

    try {
        const command = new DescribeTableCommand({ TableName: STAFF_TABLE_NAME });
        const res = await dynamoClient.send(command);
        console.log(`CONNECTION STATUS: AWS DynamoDB table '${STAFF_TABLE_NAME}' status: ${res.Table?.TableStatus || 'ACTIVE'}`);
    } catch (error: any) {
        console.warn(`DynamoDB status note: ${error?.message || 'Table initializing'}`);
    }
});