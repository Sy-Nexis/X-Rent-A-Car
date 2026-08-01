/**
 * ============================================================
 *  DEMO ACCOUNT — REMOVE (Plain Node.js, no build needed)
 * ============================================================
 *  Usage:  node scripts/demo-remove.mjs
 * ============================================================
 */

import http from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ── Load .env manually ───────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../.env');
const envVars = {};
try {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) envVars[key.trim()] = rest.join('=').trim();
  }
} catch {
  console.error('❌  Could not read .env file');
  process.exit(1);
}

const SUPABASE_URL      = envVars.SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.SUPABASE_ANON_KEY;
const DEMO_EMAIL        = 'demo@xrent.com';

// ── Supabase REST DELETE via native https ────────────────────
import https from 'https';

function supabaseDelete(email) {
  return new Promise((resolve, reject) => {
    const encodedEmail = encodeURIComponent(`eq.${email}`);
    const path = `/rest/v1/staff?email=${encodedEmail}`;
    const url = new URL(SUPABASE_URL);

    const options = {
      hostname: url.hostname,
      path,
      method: 'DELETE',
      headers: {
        'apikey'        : SUPABASE_ANON_KEY,
        'Authorization' : `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type'  : 'application/json',
        'Prefer'        : 'return=representation',
      },
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: raw }));
    });
    req.on('error', reject);
    req.end();
  });
}

function supabaseGet(email) {
  return new Promise((resolve, reject) => {
    const encodedEmail = encodeURIComponent(`eq.${email}`);
    const path = `/rest/v1/staff?email=${encodedEmail}&select=id,email`;
    const url = new URL(SUPABASE_URL);

    const options = {
      hostname: url.hostname,
      path,
      method: 'GET',
      headers: {
        'apikey'        : SUPABASE_ANON_KEY,
        'Authorization' : `Bearer ${SUPABASE_ANON_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: raw }));
    });
    req.on('error', reject);
    req.end();
  });
}

console.log(`\n🗑️  Removing demo account: ${DEMO_EMAIL} ...`);

try {
  // Check existence first
  const check = await supabaseGet(DEMO_EMAIL);
  const records = JSON.parse(check.body);

  if (!Array.isArray(records) || records.length === 0) {
    console.log('\n⚠️  No demo account found — nothing to remove.\n');
    process.exit(0);
  }

  // Delete it
  const result = await supabaseDelete(DEMO_EMAIL);

  if (result.status === 200 || result.status === 204) {
    console.log('\n✅  Demo account removed successfully.');
    console.log(`    ${DEMO_EMAIL} has been deleted from the staff table.\n`);
  } else {
    console.error(`❌  Delete failed (HTTP ${result.status}):`, result.body);
    process.exit(1);
  }
} catch (err) {
  console.error('❌  Error:', err.message);
  process.exit(1);
}
