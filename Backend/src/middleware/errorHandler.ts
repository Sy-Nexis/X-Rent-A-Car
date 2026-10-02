import { Request, Response, NextFunction } from 'express';

/**
 * Global Centralized Error Handling Middleware
 * Prevents information leakage (stack traces, SQL/DynamoDB internals) in production
 */
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

    // Log the actual error for server diagnostics
    console.error(`[SERVER_ERROR] ${req.method} ${req.originalUrl}:`, err);

    // Safe sanitized response payload
    const responsePayload: { success: boolean; message: string; stack?: string; detail?: string } = {
        success: false,
        message: statusCode === 500 && isProduction
            ? 'An unexpected internal error occurred. Please contact system support.'
            : (err.message || 'An error occurred during request processing.'),
    };

    if (!isProduction && err.stack) {
        responsePayload.stack = err.stack;
        responsePayload.detail = err.detail || err.message;
    }

    return res.status(statusCode).json(responsePayload);
};
