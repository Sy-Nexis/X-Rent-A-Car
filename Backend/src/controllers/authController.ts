import { Request, Response } from 'express';
import { supabase } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
    console.log("LOGIN_REQUEST_RECEIVED:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        console.log("LOGIN_FAIL: Missing email or password");
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const { data: staff, error } = await supabase
            .from('staff')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error) {
            console.error("SUPABASE_LOGIN_ERROR:", error);
            return res.status(500).json({ message: 'Database error', detail: error.message });
        }

        if (!staff) {
            console.log(`LOGIN_FAIL: User not found for email ${email}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log(`LOGIN_USER_FOUND: ${staff.email}, Status: ${staff.status}`);

        if (staff.status !== 'Active') {
            console.log(`LOGIN_FAIL: Account status is ${staff.status} for ${email}`);
            return res.status(401).json({ message: 'Account is inactive' });
        }

        const isMatch = await bcrypt.compare(password, staff.password_hash);
        if (!isMatch) {
            console.log(`LOGIN_FAIL: Password mismatch for ${email}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from environment variables");
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const token = jwt.sign(
            { id: staff.id, role: staff.role },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        console.log(`LOGIN_SUCCESS: User ${email} authenticated successfully`);

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

export const register = async (req: Request, res: Response) => {
    const { first_name, last_name, email, password, role, status } = req.body;
    const finalStatus = status || 'Active';

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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
            if (error.code === '23505') {
                console.log(`REGISTRATION_FAIL: Email already exists - ${email}`);
                return res.status(400).json({ message: 'Email already exists' });
            }
            console.error("SUPABASE_REGISTRATION_ERROR:", error);
            throw error;
        }

        res.status(201).json({ message: 'Staff member registered' });

    } catch (error: any) {
        console.error("REGISTRATION_ERROR:", error);
        res.status(500).json({ message: 'Registration failed' });
    }
};