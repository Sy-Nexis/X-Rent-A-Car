import pool from './src/db';

async function initDB() {
    try {
        console.log("Initializing database tables...");

        const createStaffTable = `
            CREATE TABLE IF NOT EXISTS staff (
                id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                status VARCHAR(50) DEFAULT 'Active'
            );
        `;

        const createVehiclesTable = `
            CREATE TABLE IF NOT EXISTS vehicles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                make VARCHAR(100),
                model VARCHAR(100),
                year INT,
                vin VARCHAR(100) UNIQUE NOT NULL,
                license_plate VARCHAR(50),
                transmission VARCHAR(50),
                fuel_type VARCHAR(50),
                engine_capacity VARCHAR(50),
                color VARCHAR(50),
                mileage INT,
                daily_rate DECIMAL(10, 2),
                branch VARCHAR(100),
                status VARCHAR(50) DEFAULT 'Active'
            );
        `;

        const createClientsTable = `
            CREATE TABLE IF NOT EXISTS clients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                email VARCHAR(150),
                phone VARCHAR(50),
                address VARCHAR(255),
                city VARCHAR(100),
                state VARCHAR(100),
                zip_code VARCHAR(50),
                government_id VARCHAR(100) UNIQUE NOT NULL,
                license_number VARCHAR(100),
                status VARCHAR(50) DEFAULT 'Active'
            );
        `;

        await pool.query(createStaffTable);
        console.log("- Created table 'staff'");

        await pool.query(createVehiclesTable);
        console.log("- Created table 'vehicles'");

        await pool.query(createClientsTable);
        console.log("- Created table 'clients'");

        console.log("Database initialized successfully!");
    } catch (error) {
        console.error("Error creating tables:", error);
    } finally {
        process.exit();
    }
}

initDB();
