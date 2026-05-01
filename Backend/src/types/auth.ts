import { Request } from 'express';

export interface UserPayload {
    id: number;
    role: 'Admin' | 'Manager';
}

export interface AuthRequest extends Request {
    user?: UserPayload;
}