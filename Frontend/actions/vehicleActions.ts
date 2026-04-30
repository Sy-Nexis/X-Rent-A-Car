"use server";

import pool from '../../Backend/src/db';
import { revalidatePath } from 'next/cache';

export interface Vehicle {
    id: string;
    make: string;
    model: string;
    license_plate: string;
    status: string;
    created_at?: Date;
}

// Fetch all vehicles
export async function getVehicles(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
        const [rows] = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
        return { success: true, data: rows as any[] };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, error: "Failed to fetch vehicles" };
    }
}

// Add a new vehicle
export async function addVehicle(formData: FormData) {
    try {
        const make = formData.get('make');
        const model = formData.get('model');
        const licensePlate = formData.get('licensePlate');
        const year = formData.get('year');
        const mileage = formData.get('mileage');
        const fuelType = formData.get('fuelType');
        const transmission = formData.get('transmission');

        const [result] = await pool.execute(
            'INSERT INTO vehicles (make, model, license_plate, year, mileage, fuel_type, transmission, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [make, model, licensePlate, year, mileage, fuelType, transmission, 'Active']
        );

        revalidatePath('/admin');
        revalidatePath('/admin/add-vehicle');

        return { success: true };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, error: "Failed to add vehicle" };
    }
}
