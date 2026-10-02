import express, { Application, Request, Response } from 'express';
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

// Security Middlewares
import { helmetMiddleware, corsMiddleware, apiRateLimiter } from './middleware/security';
import { sanitizeBodyMiddleware } from './middleware/validationMiddleware';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8801;

// 1. Attack Surface Reduction: Helmet Security Headers & Disable Fingerprinting
app.use(helmetMiddleware);
app.disable('x-powered-by');

// 2. Strict Restricted CORS
app.use(corsMiddleware);

// 3. Payload Size Limitation (10kb max to prevent memory exhaustion DoS)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Request Body XSS Sanitization
app.use(sanitizeBodyMiddleware);

// 5. Global API Rate Limiter
app.use('/api', apiRateLimiter);

// Request Logger (Development & Monitoring)
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
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
    res.status(200).json({ status: "Active", database: "AWS DynamoDB", timestamp: new Date().toISOString() });
});

// Centralized Error Handling Middleware (prevents info leakage)
app.use(errorHandler);

// Initialize and Start Server locally
if (!process.env.VERCEL) {
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
}

export default app;