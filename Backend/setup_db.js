const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setup() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  });

  console.log('Connected to MySQL server.');

  // Create database
  await connection.query('CREATE DATABASE IF NOT EXISTS xrent_db');
  console.log('Database xrent_db verified/created.');

  await connection.query('USE xrent_db');

  // Create staff table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS staff (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Active'
    )
  `);
  console.log('Table "staff" verified/created.');

  // Create vehicles table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      make VARCHAR(100) NOT NULL,
      model VARCHAR(100) NOT NULL,
      year INT NOT NULL,
      vin VARCHAR(50) NOT NULL UNIQUE,
      license_plate VARCHAR(50) NOT NULL UNIQUE,
      transmission VARCHAR(50),
      fuel_type VARCHAR(50),
      engine_capacity VARCHAR(50),
      color VARCHAR(50),
      mileage INT NOT NULL DEFAULT 0,
      daily_rate DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      branch VARCHAR(100),
      status VARCHAR(50) NOT NULL DEFAULT 'Available'
    )
  `);
  console.log('Table "vehicles" verified/created.');

  // Create clients table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS clients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(50),
      address TEXT,
      city VARCHAR(100),
      state VARCHAR(100),
      zip_code VARCHAR(20),
      government_id VARCHAR(100) NOT NULL UNIQUE,
      license_number VARCHAR(100),
      status VARCHAR(50) NOT NULL DEFAULT 'Active'
    )
  `);
  console.log('Table "clients" verified/created.');

  // Seed default administrator
  const email = 'admin@xrent.com';
  const [rows] = await connection.query('SELECT * FROM staff WHERE email = ?', [email]);
  if (rows.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);
    await connection.query(
      'INSERT INTO staff (first_name, last_name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      ['System', 'Administrator', email, passwordHash, 'SuperAdmin', 'Active']
    );
    console.log('Default administrator user seeded (admin@xrent.com / admin123).');
  } else {
    console.log('Default administrator user already exists.');
  }

  await connection.end();
  console.log('Database setup complete.');
}

setup().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
