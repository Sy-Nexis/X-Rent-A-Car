import { Request } from 'express';

export interface UserPayload {
    id: number;
    role: 'Staff' | 'Manager' | 'Admin' | string;
}

export interface AuthRequest extends Request {
    user?: UserPayload;
}