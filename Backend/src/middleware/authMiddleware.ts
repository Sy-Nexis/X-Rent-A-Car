import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { AuthRequest, UserPayload } from '../types/auth';

/**
 * Protect route middleware: Extracts JWT and verifies against Supabase DB active status
 */
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing' });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("CRITICAL CONFIGURATION ERROR: JWT_SECRET is missing from environment variables");
            return res.status(500).json({ message: 'Server configuration error' });
        }

        // Parse and verify the token signature
        const decoded = jwt.verify(token, jwtSecret) as UserPayload;

        // High-speed active check directly to Supabase to verify User ID exists and status remains Active
        const { data: staff, error } = await supabase
            .from('staff')
            .select('id, role, status')
            .eq('id', decoded.id)
            .maybeSingle();

        if (error || !staff) {
            console.log(`AUTH_REJECTED: User ID ${decoded.id} not found in Supabase`);
            return res.status(401).json({ message: 'The user belonging to this token no longer exists' });
        }

        if (staff.status !== 'Active') {
            console.log(`AUTH_REJECTED: User ID ${decoded.id} is suspended/inactive`);
            return res.status(401).json({ message: 'Account is suspended or inactive' });
        }

        // Append the user payload details into a typed custom Express object reference (req.user)
        req.user = { id: staff.id, role: staff.role };
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Token invalid or expired' });
    }
};

/**
 * Restrict routes to specific roles
 */
export const restrictTo = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Permission denied' });
        }
        next();
    };
};