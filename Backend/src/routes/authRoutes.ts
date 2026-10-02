import { Router } from 'express';
import { login, register, getProfile, updateProfile, changePassword } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/change-password', changePassword);

export default router;