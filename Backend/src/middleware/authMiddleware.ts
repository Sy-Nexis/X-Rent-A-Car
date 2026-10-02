import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { AuthRequest, UserPayload } from '../types/auth';

/**
 * Protect route middleware: Extracts JWT and verifies against Supabase DB active status
 * Enforces explicit cryptographic signing algorithm checking (HS256)
 */
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied: Authentication token missing.' });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET || 'xrent_secret_jwt_key_development_2026';

        // Enforce explicit cryptographic signing algorithm checking
        const decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] }) as UserPayload;

        if (!decoded || !decoded.id) {
            return res.status(401).json({ success: false, message: 'Invalid token structure.' });
        }

        // Active status check in Supabase to verify User ID exists and remains Active
        const { data: staff, error } = await supabase
            .from('staff')
            .select('id, role, status')
            .eq('id', decoded.id)
            .maybeSingle();

        if (error || !staff) {
            return res.status(401).json({ success: false, message: 'The user belonging to this token no longer exists.' });
        }

        if (staff.status !== 'Active') {
            return res.status(401).json({ success: false, message: 'Account is suspended or inactive.' });
        }

        // Append user payload details into custom Express object
        req.user = { id: staff.id, role: staff.role };
        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token is invalid, revoked, or expired.' });
    }
};

/**
 * Restrict routes to specific roles (RBAC)
 */
export const restrictTo = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Access forbidden: Insufficient security privileges.' });
        }
        next();
    };
};