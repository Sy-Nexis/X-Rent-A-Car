import pool from './src/db';

async function checkSchema() {
    try {
        const [rows] = await pool.query('SHOW TABLES');
        console.log("TABLE SCHEMA:", rows);
    } catch (e) {
        console.error("DB QUERY ERROR:", e);
    } finally {
        process.exit();
    }
}

checkSchema();
