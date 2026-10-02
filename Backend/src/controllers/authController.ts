import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
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
 * Handle user login (DynamoDB Primary with Supabase fallback)
 */
export const login = async (req: Request, res: Response) => {
    console.log("LOGIN_REQUEST_RECEIVED:", req.body?.email);
    const { email, password } = req.body;

    if (!email || !password) {
        console.log("LOGIN_FAIL: Missing email or password");
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const jwtSecret = process.env.JWT_SECRET || 'xrent_secret_jwt_key_development_2026';

    try {
        // 1. Check DynamoDB first using idx_staff_email Global Secondary Index
        let dynamoStaff = null;
        try {
            dynamoStaff = await getStaffByEmail(normalizedEmail);
        } catch (dynErr: any) {
            console.warn("DynamoDB staff lookup note (will check Supabase fallback):", dynErr.message);
        }

        if (dynamoStaff) {
            console.log(`DYNAMODB_STAFF_FOUND: ${dynamoStaff.email}, Status: ${dynamoStaff.status}`);

            if (dynamoStaff.status && dynamoStaff.status !== 'Active') {
                return res.status(401).json({ message: 'Your account is inactive. Please contact your administrator.' });
            }

            let isMatch = false;
            if (dynamoStaff.password_hash) {
                try {
                    isMatch = await bcrypt.compare(password, dynamoStaff.password_hash);
                } catch (bcryptErr) {
                    console.error("Bcrypt compare error:", bcryptErr);
                }
            }

            if (isMatch) {
                const token = jwt.sign(
                    { id: dynamoStaff.id, role: dynamoStaff.role, email: dynamoStaff.email },
                    jwtSecret,
                    { expiresIn: '12h' }
                );

                // Update last_login in DynamoDB
                updateStaffLastLogin(dynamoStaff.id).catch(() => {});

                const userName = `${dynamoStaff.first_name || ''} ${dynamoStaff.last_name || ''}`.trim() || dynamoStaff.email;
                recordAuditLog({
                    userName: userName,
                    userRole: dynamoStaff.role || 'Staff',
                    userEmail: dynamoStaff.email,
                    action: 'Login',
                    entityType: 'Auth',
                    details: `${userName} (${dynamoStaff.role || 'Staff'}) signed in via DynamoDB.`
                }).catch(() => {});

                return res.status(200).json({
                    token,
                    user: {
                        id: dynamoStaff.id,
                        name: userName,
                        email: dynamoStaff.email,
                        role: dynamoStaff.role || 'Staff'
                    }
                });
            }
        }

        // 2. Query staff table in Supabase (fallback / legacy sync)
        const { data: staff, error: dbError } = await supabase
            .from('staff')
            .select('*')
            .eq('email', normalizedEmail)
            .maybeSingle();

        if (dbError) {
            console.error("SUPABASE_QUERY_ERROR:", dbError.message);
        }

        // If staff record exists in Supabase with bcrypt hash, verify password
        if (staff) {
            console.log(`STAFF_RECORD_FOUND_SUPABASE: ${staff.email}, Status: ${staff.status}`);

            if (staff.status && staff.status !== 'Active') {
                return res.status(401).json({ message: 'Your account is inactive. Please contact your administrator.' });
            }

            let isMatch = false;
            if (staff.password_hash && staff.password_hash.startsWith('$2')) {
                try {
                    isMatch = await bcrypt.compare(password, staff.password_hash);
                } catch (bcryptErr) {
                    console.error("Bcrypt compare error:", bcryptErr);
                }
            }

            if (isMatch) {
                const token = jwt.sign(
                    { id: staff.id, role: staff.role, email: staff.email },
                    jwtSecret,
                    { expiresIn: '12h' }
                );

                // Update last_login in Supabase staff table
                supabase
                    .from('staff')
                    .update({ last_login: new Date().toISOString() })
                    .eq('id', staff.id)
                    .then();

                // Lazy-sync into DynamoDB
                try {
                    createStaff({
                        id: staff.id,
                        first_name: staff.first_name || 'Staff',
                        last_name: staff.last_name || '',
                        email: staff.email,
                        password_hash: staff.password_hash,
                        role: staff.role,
                        status: staff.status
                    }).catch(() => {});
                } catch {}

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
            }
        }

        // 3. Fallback: Authenticate against Supabase Auth (GoTrue)
        console.log(`Attempting Supabase Auth for: ${normalizedEmail}`);
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password: password
        });

        if (authError) {
            console.error("SUPABASE_AUTH_SIGNIN_ERROR:", authError.message);
        }

        if (authData?.user && !authError) {
            console.log(`SUPABASE_AUTH_SUCCESS: ${authData.user.email}`);

            // Automatically sync / upsert staff record in DB with bcrypt hash for seamless future logins
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const firstName = authData.user.user_metadata?.first_name || staff?.first_name || 'Admin';
                const lastName = authData.user.user_metadata?.last_name || staff?.last_name || '';
                const role = authData.user.user_metadata?.role || staff?.role || 'SuperAdmin';

                await supabase.from('staff').upsert({
                    email: normalizedEmail,
                    first_name: firstName,
                    last_name: lastName,
                    role: role,
                    status: 'Active',
                    password_hash: hashedPassword,
                    last_login: new Date().toISOString()
                }, { onConflict: 'email' });

                // Also save to DynamoDB
                createStaff({
                    first_name: firstName,
                    last_name: lastName,
                    email: normalizedEmail,
                    password_hash: hashedPassword,
                    role: role,
                    status: 'Active'
                }).catch(() => {});
            } catch (syncErr) {
                console.warn("Staff upsert sync notice:", syncErr);
            }

            const role = authData.user.user_metadata?.role || staff?.role || 'SuperAdmin';
            const token = jwt.sign(
                { id: authData.user.id, role, email: authData.user.email },
                jwtSecret,
                { expiresIn: '12h' }
            );

            return res.status(200).json({
                token: authData.session?.access_token || token,
                user: {
                    id: authData.user.id,
                    name: authData.user.user_metadata?.first_name
                        ? `${authData.user.user_metadata.first_name} ${authData.user.user_metadata.last_name || ''}`.trim()
                        : (staff ? `${staff.first_name} ${staff.last_name}`.trim() : authData.user.email),
                    email: authData.user.email,
                    role: role
                }
            });
        }

        return res.status(401).json({
            message: 'Invalid credentials. Please verify your email and password.'
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
    console.log("REGISTER_REQUEST_RECEIVED:", req.body?.email);
    const { first_name, last_name, email, password, role, status } = req.body;
    const finalStatus = status || 'Active';
    const finalRole = role || 'Staff';

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: 'All fields (first_name, last_name, email, password) are required.' });
    }

    try {
        const normalizedEmail = String(email).trim().toLowerCase();

        // =========================================================================
        // STEP 3: ENFORCE UNIQUE EMAIL CONSTRAINT
        // Query the DynamoDB GSI (idx_staff_email) to verify no duplicate email exists
        // =========================================================================
        try {
            const existingDynamoStaff = await getStaffByEmail(normalizedEmail);
            if (existingDynamoStaff) {
                return res.status(409).json({
                    success: false,
                    message: 'A staff member with this email address already exists. Please choose a different email or log in.'
                });
            }
        } catch (checkErr: any) {
            console.warn("DynamoDB pre-flight email check note:", checkErr?.message);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Create in DynamoDB (with application-level unique email constraint check)
        let createdDynamoStaff = null;
        try {
            createdDynamoStaff = await createStaff({
                first_name: String(first_name).trim(),
                last_name: String(last_name).trim(),
                email: normalizedEmail,
                password_hash: hashedPassword,
                role: finalRole,
                status: finalStatus,
            });
        } catch (dynCreateErr: any) {
            if (dynCreateErr.code === 'DUPLICATE_EMAIL') {
                return res.status(409).json({
                    success: false,
                    message: 'A staff member with this email address already exists.'
                });
            }
            console.warn("DynamoDB createStaff note:", dynCreateErr.message);
        }

        // 2. Also insert record into Supabase staff table for redundancy
        const { data: staffData, error: staffError } = await supabase
            .from('staff')
            .upsert([
                {
                    first_name: String(first_name).trim(),
                    last_name: String(last_name).trim(),
                    email: normalizedEmail,
                    password_hash: hashedPassword,
                    role: finalRole,
                    status: finalStatus
                }
            ], { onConflict: 'email' })
            .select();

        if (staffError) {
            console.error("SUPABASE_STAFF_INSERT_ERROR:", staffError.message);
        }

        // 3. Also create user in Supabase Auth (GoTrue)
        try {
            await supabase.auth.signUp({
                email: normalizedEmail,
                password: password,
                options: {
                    data: {
                        first_name: String(first_name).trim(),
                        last_name: String(last_name).trim(),
                        role: finalRole
                    }
                }
            });
        } catch (authErr) {
            console.warn("Supabase Auth signUp sync notice:", authErr);
        }

        const userObj = createdDynamoStaff || (staffData ? staffData[0] : { email: normalizedEmail, role: finalRole });

        return res.status(201).json({
            success: true,
            message: 'Account created successfully in database.',
            user: userObj
        });

    } catch (error: any) {
        console.error("REGISTRATION_ERROR:", error);
        return res.status(500).json({ message: 'Registration failed', detail: error.message || 'Unknown error' });
    }
};

/**
 * Get profile details for the current user
 */
export const getProfile = async (req: Request, res: Response) => {
    const email = req.query.email ? String(req.query.email).trim().toLowerCase() : undefined;

    try {
        if (!email) {
            // Return first active admin/staff if no email specified
            const { data, error } = await supabase
                .from('staff')
                .select('id, email, first_name, last_name, role, status, created_at, last_login')
                .limit(1)
                .maybeSingle();

            if (error || !data) {
                return res.status(200).json({
                    user: {
                        name: "Alex Rivera",
                        email: "alex.rivera@fleetcontrol.io",
                        phone: "+1 (555) 012-3456",
                        department: "Logistics Operations",
                        bio: "Lead Manager for the North American region. Focused on route optimization and fuel efficiency.",
                        role: "Fleet Manager"
                    }
                });
            }

            return res.status(200).json({
                user: {
                    id: data.id,
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.email,
                    email: data.email,
                    phone: "+1 (555) 012-3456",
                    department: "Logistics Operations",
                    bio: "Lead Manager for the North American region. Focused on route optimization and fuel efficiency.",
                    role: data.role || "Fleet Manager"
                }
            });
        }

        const { data: staff, error } = await supabase
            .from('staff')
            .select('id, email, first_name, last_name, role, status')
            .eq('email', email)
            .maybeSingle();

        if (error || !staff) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        return res.status(200).json({
            user: {
                id: staff.id,
                name: `${staff.first_name || ''} ${staff.last_name || ''}`.trim() || staff.email,
                email: staff.email,
                phone: "+1 (555) 012-3456",
                department: "Logistics Operations",
                bio: "Lead Manager for the North American region. Focused on route optimization and fuel efficiency.",
                role: staff.role || "Fleet Manager"
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
        const normalizedEmail = String(email).trim().toLowerCase();
        let firstName = '';
        let lastName = '';

        if (name) {
            const parts = String(name).trim().split(' ');
            firstName = parts[0] || '';
            lastName = parts.slice(1).join(' ') || '';
        }

        const updateData: any = {};
        if (firstName) updateData.first_name = firstName;
        if (lastName) updateData.last_name = lastName;
        if (role) updateData.role = role;

        const { data, error } = await supabase
            .from('staff')
            .update(updateData)
            .eq('email', normalizedEmail)
            .select();

        if (error) {
            console.warn("Could not update staff table:", error.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully!',
            user: {
                name: name || `${firstName} ${lastName}`.trim(),
                email: normalizedEmail,
                phone: phone || "+1 (555) 012-3456",
                department: department || "Logistics Operations",
                bio: bio || "",
                role: role || (data && data[0]?.role) || "Fleet Manager"
            }
        });
    } catch (err: any) {
        console.error("UPDATE_PROFILE_ERROR:", err);
        return res.status(500).json({ message: 'Internal server error while updating profile.' });
    }
};

/**
 * Change password
 */
export const changePassword = async (req: Request, res: Response) => {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email and new password are required.' });
    }

    try {
        const normalizedEmail = String(email).trim().toLowerCase();
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update in staff table
        const { error: dbError } = await supabase
            .from('staff')
            .update({ password_hash: hashedPassword })
            .eq('email', normalizedEmail);

        if (dbError) {
            console.error("STAFF_PASSWORD_UPDATE_ERROR:", dbError.message);
        }

        // Also update in DynamoDB
        updateStaffPassword(normalizedEmail, hashedPassword).catch(() => {});

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully.'
        });
    } catch (err: any) {
        console.error("CHANGE_PASSWORD_ERROR:", err);
        return res.status(500).json({ message: 'Internal server error changing password.' });
    }
};