/**
 * ============================================================
 *  DEMO ACCOUNT — CREATE (Plain Node.js, no build needed)
 * ============================================================
 *  Calls Supabase REST API directly — no backend required.
 *
 *  Usage:  node scripts/demo-create.mjs
 *  Remove: node scripts/demo-remove.mjs
 *
 *  ⚠️  This is NOT a production account.
 *      Remove it when done: npm run demo:remove
 * ============================================================
 */

import https from 'https';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

// ── Load .env manually ───────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../.env');
const envVars = {};
try {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    envVars[key] = val;
  }
} catch {
  console.error('❌  Could not read .env file');
  process.exit(1);
}

const SUPABASE_URL      = envVars.SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.SUPABASE_ANON_KEY;

// ── Demo credentials (edit here if needed) ───────────────────
const DEMO_EMAIL    = 'demo@xrent.com';
const DEMO_PASSWORD = 'Demo@1234';
const DEMO_ROLE     = 'SuperAdmin'; // SuperAdmin | FleetManager | Staff
// ─────────────────────────────────────────────────────────────

// Use bcryptjs (already installed in node_modules)
const require = createRequire(import.meta.url);
const bcrypt  = require('bcryptjs');

function supabaseRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL);
    const data = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      path: `/rest/v1/${path}`,
      method,
      headers: {
        'apikey'        : SUPABASE_ANON_KEY,
        'Authorization' : `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type'  : 'application/json',
        'Prefer'        : 'return=representation',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

console.log('\n🔧  Creating demo account...');
console.log(`    Email    : ${DEMO_EMAIL}`);
console.log(`    Password : ${DEMO_PASSWORD}`);
console.log(`    Role     : ${DEMO_ROLE}\n`);

// Check if already exists
const check = await supabaseRequest('GET', `staff?email=eq.${encodeURIComponent(DEMO_EMAIL)}&select=id`);

if (Array.isArray(check.body) && check.body.length > 0) {
  console.log('⚠️  Demo account already exists — skipping creation.');
  console.log('    Run `npm run demo:remove` first if you want to recreate it.\n');
  process.exit(0);
}

// Hash the password using bcryptjs
const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

// Insert into staff table
const result = await supabaseRequest('POST', 'staff', {
  first_name    : '⚠️ DEMO',
  last_name     : 'ACCOUNT',
  email         : DEMO_EMAIL,
  password_hash : hashedPassword,
  role          : DEMO_ROLE,
  status        : 'Active',
});

if (result.status === 201) {
  console.log('✅  Demo account created successfully!');
  console.log('┌─────────────────────────────────────┐');
  console.log(`│  Email    : ${DEMO_EMAIL.padEnd(25)}│`);
  console.log(`│  Password : ${DEMO_PASSWORD.padEnd(25)}│`);
  console.log(`│  Role     : ${DEMO_ROLE.padEnd(25)}│`);
  console.log('└─────────────────────────────────────┘');
  console.log('\n⚠️  Remember to remove when done:  npm run demo:remove\n');
} else {
  const msg = typeof result.body === 'object'
    ? (result.body.message || result.body.details || JSON.stringify(result.body))
    : result.body;

  if (msg && msg.includes('already exists')) {
    console.log('⚠️  Demo account already exists — skipping.\n');
  } else {
    console.error(`❌  Failed to create demo account (HTTP ${result.status}):`, msg);
    process.exit(1);
  }
}
