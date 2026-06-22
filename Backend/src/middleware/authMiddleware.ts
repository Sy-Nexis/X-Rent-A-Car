import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../db';
import { AuthRequest, UserPayload } from '../types/auth';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;

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
            console.log(`AUTH_REJECTED: User ID ${decoded.id} is suspended`);
            return res.status(401).json({ message: 'Account is suspended' });
        }

        // 3. Attach the fresh data from Supabase to the request
        req.user = { id: staff.id, role: staff.role };
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Token invalid or expired' });
    }
};

export const restrictTo = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Permission denied' });
        }
        next();
    };
};