"use server";

import pool from '../db';
import { revalidatePath } from 'next/cache';


export async function getVehicles() {
    try {
        const [rows] = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
        return { success: true, data: rows };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, error: "Failed to fetch vehicles" };
    }
}


export async function addVehicle(formData: FormData) {
    try {
        const make = formData.get('make');
        const model = formData.get('model');
        const licensePlate = formData.get('licensePlate');

        const [result] = await pool.execute(
            'INSERT INTO vehicles (make, model, license_plate, status) VALUES (?, ?, ?, ?)',
            [make, model, licensePlate, status]
        );

        // Next.js --> Clear Cache & Update
        revalidatePath('/admin');


        return { success: true };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, error: "Failed to add vehicle" };
    }
}