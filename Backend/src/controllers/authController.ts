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

    try {
        // Query staff table with flat O(1) performance lookup
        const { data: staff, error } = await supabase
            .from('staff')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error) {
            console.error("SUPABASE_LOGIN_ERROR:", error.message);
            return res.status(401).json({ message: 'Database error occurred during authentication' });
        }

        // Fail fast: staff record check
        if (!staff) {
            console.log(`LOGIN_FAIL: User not found for email ${email}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log(`LOGIN_USER_FOUND: ${staff.email}, Status: ${staff.status}`);

        // Guard status check: status must be Active
        if (staff.status !== 'Active') {
            console.log(`LOGIN_FAIL: Account status is ${staff.status} for ${email}`);
            return res.status(401).json({ message: 'Account is inactive' });
        }

        // Perform password hash comparison
        const isMatch = await bcrypt.compare(password, staff.password_hash);
        if (!isMatch) {
            console.log(`LOGIN_FAIL: Password mismatch for ${email}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("CRITICAL CONFIGURATION ERROR: JWT_SECRET is missing from environment variables");
            return res.status(500).json({ message: 'Server configuration error' });
        }

        // Sign token strictly expiring in 12 hours
        const token = jwt.sign(
            { id: staff.id, role: staff.role },
            jwtSecret,
            { expiresIn: '12h' }
        );

        console.log(`LOGIN_SUCCESS: User ${email} authenticated successfully`);

        // Update the last_login timestamp column in Supabase asynchronously without blocking final HTTP JSON delivery
        const currentIsoTime = new Date().toISOString();
        supabase
            .from('staff')
            .update({ last_login: currentIsoTime })
            .eq('id', staff.id)
            .then(({ error: updateError }) => {
                if (updateError) {
                    console.error(`ASYNC_LAST_LOGIN_UPDATE_ERROR for ${email}:`, updateError.message);
                } else {
                    console.log(`ASYNC_LAST_LOGIN_UPDATE_SUCCESS for ${email} at ${currentIsoTime}`);
                }
            });

        // Yield structured response perfectly aligned with frontend components
        return res.status(200).json({
            token,
            user: {
                id: staff.id,
                name: `${staff.first_name} ${staff.last_name}`,
                role: staff.role
            }
        });
    } catch (error: any) {
        console.error("LOGIN_ERROR:", error);
        return res.status(500).json({ message: 'Server error', detail: error.message || 'Unknown error' });
    }
};

/**
 * Handle staff registration
 */
export const register = async (req: Request, res: Response) => {
    console.log("REGISTER_REQUEST_RECEIVED:", req.body);
    const { first_name, last_name, email, password, role, status } = req.body;
    const finalStatus = status || 'Active';

    if (!first_name || !last_name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields (first_name, last_name, email, password, role) are required' });
    }

    try {
        // Automatically hash the cleartext password using a bcrypt workload factor salt of 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Issue an insert statement to the staff table
        const { error } = await supabase
            .from('staff')
            .insert([
                {
                    first_name,
                    last_name,
                    email,
                    password_hash: hashedPassword,
                    role,
                    status: finalStatus
                }
            ]);

        if (error) {
            // Trap unique_violation code 23505
            if (error.code === '23505') {
                console.log(`REGISTRATION_FAIL: Email already exists - ${email}`);
                return res.status(400).json({ message: 'Email already exists' });
            }
            console.error("SUPABASE_REGISTRATION_ERROR:", error.message);
            return res.status(400).json({ message: error.message || 'Registration failed' });
        }

        console.log(`REGISTRATION_SUCCESS: Registered staff member ${email}`);
        return res.status(201).json({ message: 'Staff member registered' });

    } catch (error: any) {
        console.error("REGISTRATION_ERROR:", error);
        return res.status(500).json({ message: 'Registration failed', detail: error.message || 'Unknown error' });
    }
};