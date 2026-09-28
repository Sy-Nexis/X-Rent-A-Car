import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Handle user login
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
        // 1. Query staff table in Supabase
        const { data: staff, error: dbError } = await supabase
            .from('staff')
            .select('*')
            .eq('email', normalizedEmail)
            .maybeSingle();

        if (dbError) {
            console.error("SUPABASE_QUERY_ERROR:", dbError.message);
        }

        // 2. If staff record exists with bcrypt hash, verify password
        if (staff) {
            console.log(`STAFF_RECORD_FOUND: ${staff.email}, Status: ${staff.status}`);

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

                return res.status(200).json({
                    token,
                    user: {
                        id: staff.id,
                        name: `${staff.first_name || ''} ${staff.last_name || ''}`.trim() || staff.email,
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
 * Handle staff registration
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
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Insert record into Supabase staff table
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

        // 2. Also create user in Supabase Auth (GoTrue)
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

        return res.status(201).json({
            message: 'Account created successfully in database.',
            user: staffData ? staffData[0] : { email: normalizedEmail, role: finalRole }
        });

    } catch (error: any) {
        console.error("REGISTRATION_ERROR:", error);
        return res.status(500).json({ message: 'Registration failed', detail: error.message || 'Unknown error' });
    }
};