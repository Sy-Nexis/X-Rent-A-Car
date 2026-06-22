import { supabase } from './src/db';

async function checkConnection() {
    try {
        // Try to fetch one row from any table to test connection
        const { data, error } = await supabase.from('vehicles').select('id').limit(1);
        
        if (error) {
            console.error("SUPABASE CONNECTION ERROR:", error.message);
        } else {
            console.log("SUPABASE CONNECTION SUCCESSFUL. DATA:", data);
        }
    } catch (e) {
        console.error("UNEXPECTED ERROR:", e);
    } finally {
        process.exit();
    }
}

checkConnection();
