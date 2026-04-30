"use server";

import { revalidatePath } from 'next/cache';

const BACKEND_URL = 'http://localhost:5000/api';

export interface Vehicle {
    id: string;
    make: string;
    model: string;
    license_plate: string;
    status: string;
    created_at?: Date;
}

// Fetch all vehicles via Backend API
export async function getVehicles(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
        const res = await fetch(`${BACKEND_URL}/vehicles`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch from backend');
        return await res.json();
    } catch (error) {
        console.error("API Error:", error);
        return { success: false, error: "Backend communication failed" };
    }
}

// Add a new vehicle via Backend API
export async function addVehicle(formData: FormData) {
    try {
        const data = {
            make: formData.get('make'),
            model: formData.get('model'),
            licensePlate: formData.get('licensePlate'),
            year: formData.get('year'),
            mileage: formData.get('mileage'),
            fuelType: formData.get('fuelType'),
            transmission: formData.get('transmission'),
        };

        const res = await fetch(`${BACKEND_URL}/vehicles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Failed to add via backend');
        
        const result = await res.json();
        
        if (result.success) {
            revalidatePath('/');
            revalidatePath('/add-vehicle');
        }

        return result;
    } catch (error) {
        console.error("API Error:", error);
        return { success: false, error: "Backend communication failed" };
    }
}
