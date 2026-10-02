import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';

/**
 * Strips dangerous HTML, script tags, and event handlers from strings
 */
export function sanitizeString(val: string): string {
    if (typeof val !== 'string') return val;
    return val
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
}

/**
 * Recursively sanitizes all string fields in an object or array
 */
export function sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') return sanitizeString(obj);
    if (Array.isArray(obj)) return obj.map(sanitizeObject);
    if (typeof obj === 'object') {
        const sanitized: Record<string, any> = {};
        for (const key of Object.keys(obj)) {
            sanitized[key] = sanitizeObject(obj[key]);
        }
        return sanitized;
    }
    return obj;
}

/**
 * Middleware to sanitize incoming request bodies against persistent XSS
 */
export const sanitizeBodyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    next();
};

/**
 * 1. AUTHENTICATION VALIDATION SCHEMAS
 */
export const loginSchema = z.object({
    email: z.string().email('Invalid email address format').min(3).max(254),
    password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
    first_name: z.string().min(1, 'First name is required').max(100),
    last_name: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Invalid email address format').max(254),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(128)
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    role: z.string().optional().default('Staff'),
    status: z.enum(['Active', 'Inactive', 'Suspended']).optional().default('Active'),
});

export const changePasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(8, 'New password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
});

/**
 * 2. VEHICLE INPUT VALIDATION SCHEMA
 */
export const vehicleSchema = z.object({
    make: z.string().min(1, 'Vehicle make is required').max(50),
    model: z.string().min(1, 'Vehicle model is required').max(50),
    year: z.union([z.number().int().min(1950).max(2035), z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number')]),
    licensePlate: z.string().min(2, 'License plate is required').max(20),
    vin: z.string().max(30).optional().default(''),
    fuelType: z.string().max(30).optional().default('Petrol'),
    transmission: z.string().max(30).optional().default('Automatic'),
    dailyRate: z.union([z.number().min(0, 'Daily rate must be non-negative'), z.string()]).optional().default(0),
    status: z.string().optional().default('Active'),
});

/**
 * 3. CLIENT INPUT VALIDATION SCHEMA
 */
export const clientSchema = z.object({
    first_name: z.string().min(1, 'First name is required').max(100),
    last_name: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Invalid email address format').max(254),
    phone: z.string().max(30).optional().default(''),
    government_id: z.string().min(5, 'National ID (NIC) / Government ID is required').max(50),
    license_number: z.string().max(50).optional().default(''),
    address: z.string().max(255).optional().default(''),
    city: z.string().max(100).optional().default(''),
    state: z.string().max(100).optional().default('Western Province'),
    zip_code: z.string().max(20).optional().default(''),
    status: z.string().optional().default('Active'),
});

/**
 * Generic Validation Middleware Generator using Zod
 */
export const validateBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed on request payload',
                    errors: errorMessages,
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Invalid request payload format',
            });
        }
    };
};
