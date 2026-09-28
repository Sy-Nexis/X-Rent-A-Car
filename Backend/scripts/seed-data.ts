import { supabase } from '../src/db';
import dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
    console.log("🌱 Seeding Supabase database with initial vehicles and clients...");

    const vehicles = [
        {
            make: 'Freightliner',
            model: 'Cascadia',
            year: 2024,
            vin: 'ID: FC-992-K',
            license_plate: 'TX-78-PXQ',
            transmission: 'Automatic',
            fuel_type: 'Electric',
            engine_capacity: 'EV-100',
            color: 'Midnight Black',
            mileage: 12000,
            daily_rate: 245.00,
            branch: 'Central Hub',
            status: 'Available'
        },
        {
            make: 'Volvo',
            model: 'VNL 860',
            year: 2023,
            vin: 'ID: FC-441-S',
            license_plate: 'CA-12-LMN',
            transmission: 'Automatic',
            fuel_type: 'Diesel',
            engine_capacity: 'Diesel-V6',
            color: 'Silver',
            mileage: 34000,
            daily_rate: 210.50,
            branch: 'West Hub',
            status: 'Maintenance'
        },
        {
            make: 'Kenworth',
            model: 'T680',
            year: 2024,
            vin: 'ID: FC-209-X',
            license_plate: 'WA-88-RTB',
            transmission: 'Manual',
            fuel_type: 'Hybrid',
            engine_capacity: 'Hy-Brid',
            color: 'Blue',
            mileage: 8000,
            daily_rate: 230.00,
            branch: 'East Hub|In Prep',
            status: 'Maintenance'
        },
        {
            make: 'Peterbilt',
            model: '579',
            year: 2023,
            vin: 'ID: FC-112-P',
            license_plate: 'FL-45-QWE',
            transmission: 'Automatic',
            fuel_type: 'Diesel',
            engine_capacity: 'Clean-Diesel',
            color: 'White',
            mileage: 25000,
            daily_rate: 275.00,
            branch: 'South Hub',
            status: 'Available'
        }
    ];

    const clients = [
        {
            first_name: 'Alpha Logistics',
            last_name: 'Inc.',
            email: 'john@alphalogistics.com',
            phone: '+1 (555) 019-2834',
            address: '100 Logistics Blvd',
            city: 'Dallas',
            state: 'TX',
            zip_code: '75001',
            government_id: 'US-CORP-9921',
            license_number: 'DL-TX-99021',
            status: 'Active'
        },
        {
            first_name: 'Global Freight',
            last_name: 'Co.',
            email: 'sarah@globalfreight.com',
            phone: '+1 (555) 382-9912',
            address: '450 Freight Way',
            city: 'Los Angeles',
            state: 'CA',
            zip_code: '90001',
            government_id: 'US-CORP-4401',
            license_number: 'DL-CA-44012',
            status: 'Pending'
        },
        {
            first_name: 'Apex',
            last_name: 'Deliveries',
            email: 'mike@apex.com',
            phone: '+1 (555) 771-0023',
            address: '78 Express Lane',
            city: 'Seattle',
            state: 'WA',
            zip_code: '98101',
            government_id: 'US-CORP-2099',
            license_number: 'DL-WA-20991',
            status: 'Active'
        },
        {
            first_name: 'Nexus Transport',
            last_name: 'Ltd.',
            email: 'emma@nexustrans.com',
            phone: '+1 (555) 129-8834',
            address: '12 Terminal Road',
            city: 'Miami',
            state: 'FL',
            zip_code: '33101',
            government_id: 'US-CORP-1120',
            license_number: 'DL-FL-11204',
            status: 'Inactive'
        },
        {
            first_name: 'Prime Movers',
            last_name: 'LLC',
            email: 'robert@primemovers.com',
            phone: '+1 (555) 902-1145',
            address: '330 Cargo Ave',
            city: 'Chicago',
            state: 'IL',
            zip_code: '60601',
            government_id: 'US-CORP-5521',
            license_number: 'DL-IL-55210',
            status: 'Active'
        },
        {
            first_name: 'Velocity Courier',
            last_name: 'Services',
            email: 'lisa@velocitycourier.com',
            phone: '+1 (555) 441-7782',
            address: '89 Fast Track St',
            city: 'New York',
            state: 'NY',
            zip_code: '10001',
            government_id: 'US-CORP-6632',
            license_number: 'DL-NY-66329',
            status: 'Active'
        }
    ];

    // Seed vehicles
    for (const v of vehicles) {
        const { error } = await supabase.from('vehicles').upsert(v, { onConflict: 'vin' });
        if (error) {
            console.error(`Error inserting vehicle ${v.vin}:`, error.message);
        } else {
            console.log(`✅ Vehicle ${v.make} ${v.model} (${v.vin}) inserted/verified.`);
        }
    }

    // Seed clients
    for (const c of clients) {
        const { error } = await supabase.from('clients').upsert(c, { onConflict: 'government_id' });
        if (error) {
            console.error(`Error inserting client ${c.first_name} ${c.last_name}:`, error.message);
        } else {
            console.log(`✅ Client ${c.first_name} ${c.last_name} (${c.government_id}) inserted/verified.`);
        }
    }

    console.log("✨ Seeding completed successfully!");
}

seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
