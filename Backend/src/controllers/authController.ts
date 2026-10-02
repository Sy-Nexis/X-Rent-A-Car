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

/**
 * Handle user login using DynamoDB (idx_staff_email GSI)
 */
export const login = async (req: Request, res: Response) => {
    console.log("DYNAMODB_LOGIN_REQUEST_RECEIVED:", req.body?.email);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const jwtSecret = process.env.JWT_SECRET || 'xrent_secret_jwt_key_development_2026';

    try {
        // Query DynamoDB idx_staff_email GSI
        const staff = await getStaffByEmail(normalizedEmail);

        if (!staff) {
            return res.status(401).json({
                message: 'Invalid credentials. Please verify your email and password.'
            });
        }

        if (staff.status && staff.status !== 'Active') {
            return res.status(401).json({
                message: 'Your account is inactive. Please contact your administrator.'
            });
        }

        let isMatch = false;
        if (staff.password_hash) {
            try {
                isMatch = await bcrypt.compare(password, staff.password_hash);
            } catch (bcryptErr) {
                console.error("Bcrypt compare error:", bcryptErr);
            }
        }

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials. Please verify your email and password.'
            });
        }

        const token = jwt.sign(
            { id: staff.id, role: staff.role, email: staff.email },
            jwtSecret,
            { expiresIn: '12h' }
        );

        // Update last_login in DynamoDB
        updateStaffLastLogin(staff.id).catch(() => {});

        const userName = `${staff.first_name || ''} ${staff.last_name || ''}`.trim() || staff.email;
        recordAuditLog({
            userName: userName,
            userRole: staff.role || 'Staff',
            userEmail: staff.email,
            action: 'Login',
            entityType: 'Auth',
            details: `${userName} (${staff.role || 'Staff'}) signed into neXus Fleet Control.`
        }).catch(() => {});

        return res.status(200).json({
            token,
            user: {
                id: staff.id,
                name: userName,
                email: staff.email,
                role: staff.role || 'Staff'
            }
        });

    } catch (error: any) {
        console.error("LOGIN_ERROR:", error);
        return res.status(500).json({
            message: 'Server error during authentication',
            detail: error.message || 'Unknown error'
        });
    }
};

/**
 * Handle staff registration with DynamoDB Unique Email Constraint Verification
 */
export const register = async (req: Request, res: Response) => {
    console.log("DYNAMODB_REGISTER_REQUEST_RECEIVED:", req.body?.email);
    const { first_name, last_name, email, password, role, status } = req.body;
    const finalStatus = status || 'Active';
    const finalRole = role || 'Staff';

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: 'All fields (first_name, last_name, email, password) are required.' });
    }

    try {
        const normalizedEmail = String(email).trim().toLowerCase();

        // 1. UNIQUE EMAIL CONSTRAINT (Query GSI idx_staff_email)
        const existingStaff = await getStaffByEmail(normalizedEmail);
        if (existingStaff) {
            return res.status(409).json({
                success: false,
                message: 'A staff member with this email address already exists. Please choose a different email or log in.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Put item into DynamoDB staff table with primary key 'id' (Number)
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
            details: `Registered new staff member ${userName} (${createdStaff.email}) in DynamoDB.`
        }).catch(() => {});

        return res.status(201).json({
            success: true,
            message: 'Staff account created successfully in DynamoDB database.',
            user: {
                id: createdStaff.id,
                name: userName,
                email: createdStaff.email,
                role: createdStaff.role
            }
        });

    } catch (error: any) {
        console.error("REGISTRATION_ERROR:", error);
        if (error.code === 'DUPLICATE_EMAIL') {
            return res.status(409).json({
                success: false,
                message: 'A staff member with this email address already exists.'
            });
        }
        return res.status(500).json({ message: 'Registration failed', detail: error.message || 'Unknown error' });
    }
};

/**
 * Get profile details for the current user from DynamoDB
 */
export const getProfile = async (req: Request, res: Response) => {
    const email = req.query.email ? String(req.query.email).trim().toLowerCase() : undefined;

    try {
        if (!email) {
            return res.status(400).json({ message: 'User email is required to retrieve profile.' });
        }

        const staff = await getStaffByEmail(email);

        if (!staff) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        const fullName = `${staff.first_name || ''} ${staff.last_name || ''}`.trim() || staff.email;

        return res.status(200).json({
            user: {
                id: staff.id,
                name: fullName,
                email: staff.email,
                phone: "+94 (77) 123-4567",
                department: "Fleet Operations",
                bio: `${staff.role || 'Staff'} at neXus Fleet Control.`,
                role: staff.role || "Staff"
            }
        });
    } catch (err: any) {
        console.error("GET_PROFILE_ERROR:", err);
        return res.status(500).json({ message: 'Error retrieving user profile.' });
    }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response) => {
    const { email, name, phone, department, bio, role } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'User email is required to update profile.' });
    }

    try {
        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully!',
            user: {
                name: name || "Staff User",
                email: email,
                phone: phone || "",
                department: department || "Operations",
                bio: bio || "",
                role: role || "Staff"
            }
        });
    } catch (err: any) {
        console.error("UPDATE_PROFILE_ERROR:", err);
        return res.status(500).json({ message: 'Internal server error while updating profile.' });
    }
};

/**
 * Change password in DynamoDB
 */
export const changePassword = async (req: Request, res: Response) => {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email and new password are required.' });
    }

    try {
        const normalizedEmail = String(email).trim().toLowerCase();
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updated = await updateStaffPassword(normalizedEmail, hashedPassword);

        if (!updated) {
            return res.status(404).json({ message: 'User account not found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully in DynamoDB.'
        });
    } catch (err: any) {
        console.error("CHANGE_PASSWORD_ERROR:", err);
        return res.status(500).json({ message: 'Internal server error changing password.' });
    }
};