/**
 * ============================================================
 *  DEMO ACCOUNT — REMOVE SCRIPT
 * ============================================================
 *  Permanently deletes the demo account from Supabase.
 *
 *  Usage:  npm run demo:remove
 * ============================================================
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const DEMO_EMAIL = 'demo@xrent.com';

async function removeDemoAccount() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  console.log(`\n🗑️  Removing demo account: ${DEMO_EMAIL} ...`);

  // Check it exists first
  const { data: existing } = await supabase
    .from('staff')
    .select('id')
    .eq('email', DEMO_EMAIL)
    .maybeSingle();

  if (!existing) {
    console.log('\n⚠️  No demo account found — nothing to remove.\n');
    process.exit(0);
  }

  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('email', DEMO_EMAIL);

  if (error) {
    console.error('\n❌  Failed to remove demo account:', error.message);
    process.exit(1);
  }

  console.log('\n✅  Demo account removed successfully.');
  console.log(`    ${DEMO_EMAIL} has been deleted from the staff table.\n`);
}

removeDemoAccount();
