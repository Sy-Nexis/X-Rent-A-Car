/**
 * ============================================================
 *  DEMO ACCOUNT — CREATE SCRIPT
 * ============================================================
 *  Creates a temporary demo account in the Supabase `staff` table.
 *
 *  Usage:   npm run demo:create
 *  Remove:  npm run demo:remove
 *
 *  ⚠️  This is NOT a production account.
 *      Remove it when done: npm run demo:remove
 * ============================================================
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// ── Demo credentials (edit here if needed) ──────────────────
const DEMO_EMAIL    = 'demo@xrent.com';
const DEMO_PASSWORD = 'Demo@1234';
const DEMO_ROLE     = 'SuperAdmin'; // SuperAdmin | FleetManager | Staff
// ────────────────────────────────────────────────────────────

async function createDemoAccount() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  console.log('\n🔧  Creating demo account...');
  console.log(`    Email : ${DEMO_EMAIL}`);
  console.log(`    Role  : ${DEMO_ROLE}`);

  // Check if it already exists
  const { data: existing } = await supabase
    .from('staff')
    .select('id')
    .eq('email', DEMO_EMAIL)
    .maybeSingle();

  if (existing) {
    console.log('\n⚠️  Demo account already exists — skipping creation.');
    console.log('    Run `npm run demo:remove` first if you want to recreate it.\n');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  const { error } = await supabase.from('staff').insert([
    {
      first_name    : '⚠️ DEMO',        // Clearly marked in DB
      last_name     : 'ACCOUNT',
      email         : DEMO_EMAIL,
      password_hash : hashedPassword,
      role          : DEMO_ROLE,
      status        : 'Active',
    },
  ]);

  if (error) {
    console.error('\n❌  Failed to create demo account:', error.message);
    process.exit(1);
  }

  console.log('\n✅  Demo account created successfully!');
  console.log('┌─────────────────────────────────────┐');
  console.log(`│  Email    : ${DEMO_EMAIL.padEnd(25)}│`);
  console.log(`│  Password : ${DEMO_PASSWORD.padEnd(25)}│`);
  console.log(`│  Role     : ${DEMO_ROLE.padEnd(25)}│`);
  console.log('└─────────────────────────────────────┘');
  console.log('\n⚠️  Remember to remove it when done:');
  console.log('    npm run demo:remove\n');
}

createDemoAccount();
