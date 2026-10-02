import { Router } from 'express';
import { login, register, getProfile, updateProfile, changePassword } from '../controllers/authController';
import { authRateLimiter } from '../middleware/security';
import { validateBody, loginSchema, registerSchema, changePasswordSchema } from '../middleware/validationMiddleware';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public Auth Endpoints with Rate Limiting & Strict Zod Validation
router.post('/login', authRateLimiter, validateBody(loginSchema), login);
router.post('/register', authRateLimiter, validateBody(registerSchema), register);

// Authenticated Profile Endpoints
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/change-password', authRateLimiter, validateBody(changePasswordSchema), changePassword);

export default router;