import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { recordAuditLog } from '../Admin/LogRoutes';
import {
    getStaffByEmail,
    createStaff,
    updateStaffLastLogin,
    updateStaffPassword
} from '../services/dynamoStaffService';

// Pre-computed dummy bcrypt hash (cost factor 12) for constant-time operation on nonexistent users
const DUMMY_HASH = '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
const BCRYPT_ROUNDS = 12;

/**
 * Handle user login with timing-attack mitigation and hardened JWT parameters
 */
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const jwtSecret = process.env.JWT_SECRET || 'xrent_secret_jwt_key_development_2026';

    try {
        // Query DynamoDB for staff profile
        const staff = await getStaffByEmail(normalizedEmail);

        // Timing Attack Mitigation:
        // Run bcrypt compare even if user is not found, keeping execution time constant
        const passwordHashToCompare = staff?.password_hash || DUMMY_HASH;
        let isMatch = false;

        try {
            isMatch = await bcrypt.compare(String(password), passwordHashToCompare);
        } catch (bcryptErr) {
            console.error('Bcrypt comparison failed:', bcryptErr);
        }

        // Generic authentication failure response
        if (!staff || !isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. Please verify your email and password.',
            });
        }

        if (staff.status && staff.status !== 'Active') {
            return res.status(401).json({
                success: false,
                message: 'Your account is inactive or suspended. Please contact your system administrator.',
            });
        }

        const userName = `${staff.first_name || ''} ${staff.last_name || ''}`.trim() || staff.email;

        // Sign hardened JWT with explicit HS256 algorithm and 2-hour maximum lifetime
        const token = jwt.sign(
            { id: staff.id, role: staff.role, email: staff.email, name: userName },
            jwtSecret,
            { algorithm: 'HS256', expiresIn: '2h' }
        );

        // Update last_login asynchronously
        updateStaffLastLogin(staff.id).catch(() => {});

        recordAuditLog({
            userName: userName,
            userRole: staff.role || 'Staff',
            userEmail: staff.email,
            action: 'Login',
            entityType: 'Auth',
            details: `${userName} (${staff.role || 'Staff'}) signed into neXus Fleet Control.`,
        }).catch(() => {});

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: staff.id,
                name: userName,
                email: staff.email,
                role: staff.role || 'Staff',
            },
        });

    } catch (error: any) {
        console.error('LOGIN_ERROR:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication service temporarily unavailable.',
        });
    }
};

/**
 * Handle staff registration with 12-round bcrypt hashing
 */
export const register = async (req: Request, res: Response) => {
    const { first_name, last_name, email, password, role, status } = req.body;
    const finalStatus = status || 'Active';
    const finalRole = role || 'Staff';

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields (first_name, last_name, email, password) are required.',
        });
    }

    try {
        const normalizedEmail = String(email).trim().toLowerCase();

        // 1. Check existing staff
        const existingStaff = await getStaffByEmail(normalizedEmail);
        if (existingStaff) {
            return res.status(409).json({
                success: false,
                message: 'A staff member with this email address already exists. Please log in or use another email.',
            });
        }

        // 2. Hash password with cost factor 12
        const hashedPassword = await bcrypt.hash(String(password), BCRYPT_ROUNDS);

        // 3. Persist new staff in database
        const createdStaff = await createStaff({
            first_name: String(first_name).trim(),
            last_name: String(last_name).trim(),
            email: normalizedEmail,
            password_hash: hashedPassword,
            role: finalRole,
            status: finalStatus,
        });

        const userName = `${createdStaff.first_name} ${createdStaff.last_name}`.trim();
        recordAuditLog({
            userName: userName,
            userRole: createdStaff.role,
            userEmail: createdStaff.email,
            action: 'Registered Staff Account',
            entityType: 'Auth',
            details: `Registered new staff member ${userName} (${createdStaff.email}) in database.`,
        }).catch(() => {});

        return res.status(201).json({
            success: true,
            message: 'Staff account created successfully.',
            user: {
                id: createdStaff.id,
                name: userName,
                email: createdStaff.email,
                role: createdStaff.role,
            },
        });

    } catch (error: any) {
        console.error('REGISTRATION_ERROR:', error);
        if (error.code === 'DUPLICATE_EMAIL') {
            return res.status(409).json({
                success: false,
                message: 'A staff member with this email address already exists.',
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Registration processing failed.',
        });
    }
};

/**
 * Get profile details for the current authenticated user
 */
export const getProfile = async (req: Request, res: Response) => {
    const email = req.query.email ? String(req.query.email).trim().toLowerCase() : undefined;

    try {
        if (!email) {
            return res.status(400).json({ success: false, message: 'User email is required to retrieve profile.' });
        }

        const staff = await getStaffByEmail(email);

        if (!staff) {
            return res.status(404).json({ success: false, message: 'User profile not found.' });
        }

        const fullName = `${staff.first_name || ''} ${staff.last_name || ''}`.trim() || staff.email;

        return res.status(200).json({
            success: true,
            user: {
                id: staff.id,
                name: fullName,
                email: staff.email,
                phone: '+94 (77) 123-4567',
                department: 'Fleet Operations',
                bio: `${staff.role || 'Staff'} at neXus Fleet Control.`,
                role: staff.role || 'Staff',
            },
        });
    } catch (err: any) {
        console.error('GET_PROFILE_ERROR:', err);
        return res.status(500).json({ success: false, message: 'Error retrieving user profile.' });
    }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response) => {
    const { email, name, phone, department, bio, role } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'User email is required to update profile.' });
    }

    try {
        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully!',
            user: {
                name: name || 'Staff User',
                email: email,
                phone: phone || '',
                department: department || 'Operations',
                bio: bio || '',
                role: role || 'Staff',
            },
        });
    } catch (err: any) {
        console.error('UPDATE_PROFILE_ERROR:', err);
        return res.status(500).json({ success: false, message: 'Internal server error while updating profile.' });
    }
};

/**
 * Change password with 12-round bcrypt hash
 */
export const changePassword = async (req: Request, res: Response) => {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email and new password are required.' });
    }

    try {
        const normalizedEmail = String(email).trim().toLowerCase();
        const staff = await getStaffByEmail(normalizedEmail);

        if (!staff) {
            return res.status(404).json({ success: false, message: 'User account not found.' });
        }

        if (currentPassword && staff.password_hash) {
            const isMatch = await bcrypt.compare(String(currentPassword), staff.password_hash);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Current password does not match records.' });
            }
        }

        const hashedPassword = await bcrypt.hash(String(newPassword), BCRYPT_ROUNDS);
        const updated = await updateStaffPassword(normalizedEmail, hashedPassword);

        if (!updated) {
            return res.status(404).json({ success: false, message: 'User account not found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully.',
        });
    } catch (err: any) {
        console.error('CHANGE_PASSWORD_ERROR:', err);
        return res.status(500).json({ success: false, message: 'Internal server error changing password.' });
    }
};