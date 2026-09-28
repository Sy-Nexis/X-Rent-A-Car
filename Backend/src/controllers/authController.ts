import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Handle user login
 */
export const login = async (req: Request, res: Response) => {
    console.log("LOGIN_REQUEST_RECEIVED:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        console.log("LOGIN_FAIL: Missing email or password");
        return res.status(401).json({ message: 'Email and password are required' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'xrent_secret_jwt_key_development_2026';

    try {
        // 1. Query staff table in Supabase
        const { data: staff, error: dbError } = await supabase
            .from('staff')
            .select('*')
            .eq('email', email.trim().toLowerCase())
            .maybeSingle();

        if (dbError) {
            console.error("SUPABASE_QUERY_ERROR:", dbError.message);
        }

        // 2. If staff record exists, verify password
        if (staff) {
            console.log(`LOGIN_USER_FOUND: ${staff.email}, Status: ${staff.status}`);

            if (staff.status && staff.status !== 'Active') {
                return res.status(401).json({ message: 'Account is inactive. Please contact administration.' });
            }

            let isMatch = false;
            if (staff.password_hash) {
                isMatch = await bcrypt.compare(password, staff.password_hash);
            }

            if (isMatch) {
                const token = jwt.sign(
                    { id: staff.id, role: staff.role, email: staff.email },
                    jwtSecret,
                    { expiresIn: '12h' }
                );

                // Update last_login in Supabase
                supabase
                    .from('staff')
                    .update({ last_login: new Date().toISOString() })
                    .eq('id', staff.id)
                    .then();

                return res.status(200).json({
                    token,
                    user: {
                        id: staff.id,
                        name: `${staff.first_name} ${staff.last_name}`.trim(),
                        email: staff.email,
                        role: staff.role
                    }
                });
            }
        }

        // 3. Fallback: Verify against Supabase Auth directly
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password: password
        });

        if (authData?.user && !authError) {
            const token = jwt.sign(
                { id: authData.user.id, role: authData.user.user_metadata?.role || 'Admin', email: authData.user.email },
                jwtSecret,
                { expiresIn: '12h' }
            );

            return res.status(200).json({
                token: authData.session?.access_token || token,
                user: {
                    id: authData.user.id,
                    name: authData.user.user_metadata?.first_name 
                        ? `${authData.user.user_metadata.first_name} ${authData.user.user_metadata.last_name || ''}`.trim()
                        : authData.user.email,
                    email: authData.user.email,
                    role: authData.user.user_metadata?.role || 'Admin'
                }
            });
        }

        return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });

    } catch (error: any) {
        console.error("LOGIN_ERROR:", error);
        return res.status(500).json({ message: 'Server error during authentication', detail: error.message || 'Unknown error' });
    }
};

/**
 * Handle staff registration
 */
export const register = async (req: Request, res: Response) => {
    console.log("REGISTER_REQUEST_RECEIVED:", req.body);
    const { first_name, last_name, email, password, role, status } = req.body;
    const finalStatus = status || 'Active';
    const finalRole = role || 'Staff';

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: 'All fields (first_name, last_name, email, password) are required' });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Insert record into Supabase staff table
        const { data: staffData, error: staffError } = await supabase
            .from('staff')
            .insert([
                {
                    first_name: first_name.trim(),
                    last_name: last_name.trim(),
                    email: normalizedEmail,
                    password_hash: hashedPassword,
                    role: finalRole,
                    status: finalStatus
                }
            ])
            .select();

        if (staffError) {
            if (staffError.code === '23505') {
                return res.status(400).json({ message: 'An account with this email already exists.' });
            }
            console.error("SUPABASE_STAFF_INSERT_ERROR:", staffError.message);
        }

        // 2. Also register with Supabase Auth for complete synchronization
        try {
            await supabase.auth.signUp({
                email: normalizedEmail,
                password: password,
                options: {
                    data: {
                        first_name: first_name.trim(),
                        last_name: last_name.trim(),
                        role: finalRole
                    }
                }
            });
        } catch (authErr) {
            console.warn("Supabase Auth signUp sync note:", authErr);
        }

        return res.status(201).json({
            message: 'Staff member registered successfully in Supabase database.',
            user: staffData ? staffData[0] : { email: normalizedEmail, role: finalRole }
        });

    } catch (error: any) {
        console.error("REGISTRATION_ERROR:", error);
        return res.status(500).json({ message: 'Registration failed', detail: error.message || 'Unknown error' });
    }
};