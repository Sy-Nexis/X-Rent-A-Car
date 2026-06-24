import { supabase } from './src/db';

async function checkSchema() {
    const { data, error } = await supabase.from('vehicles').select('*').limit(1);
    if (error) {
        console.error('Error fetching vehicles:', error);
        return;
    }
    if (data && data.length > 0) {
        console.log('Sample vehicle record:', data[0]);
        console.log('Columns:', Object.keys(data[0]));
    } else {
        console.log('No vehicles found to check schema.');
    }
}

checkSchema();
