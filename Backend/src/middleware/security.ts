import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * 1. HELMET SECURITY CONFIGURATION
 * Enforces CSP, HSTS, Frameguard, and X-Content-Type-Options
 */
export const helmetMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://*.supabase.co", "https://*.amazonaws.com"],
            fontSrc: ["'self'", "data:", "https:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
    },
    frameguard: {
        action: 'deny', // Prevent clickjacking
    },
    noSniff: true, // X-Content-Type-Options: nosniff
    hidePoweredBy: true, // Disable X-Powered-By
});

/**
 * 2. STRICT RESTRICTED CORS CONFIGURATION
 * Whitelists authorized frontend origins with credentials and specific HTTP methods
 */
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'https://xnrent.com',
    'https://xrent.vercel.app',
].filter(Boolean) as string[];

export const corsMiddleware = cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (such as mobile apps or curl requests in server-to-server calls)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        } else {
            return callback(new Error('CORS Policy: Request origin not allowed by security policy.'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    maxAge: 86400, // 24 hours preflight cache
});

/**
 * 3. GLOBAL API RATE LIMITER
 * Restricts general API requests to 100 requests per 15 minutes per IP
 */
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    standardHeaders: true, // Return RateLimit-* headers
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP. Please try again after 15 minutes.',
    },
    statusCode: 429,
});

/**
 * 4. STRICT AUTHENTICATION RATE LIMITER
 * Mitigates brute-force attacks on login and registration (5 attempts per 15 minutes)
 */
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 attempts per 15 mins for development/testing headroom, production strict
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            message: 'Too many authentication attempts. Your access is temporarily rate-limited for security. Please try again later.',
        });
    },
});
