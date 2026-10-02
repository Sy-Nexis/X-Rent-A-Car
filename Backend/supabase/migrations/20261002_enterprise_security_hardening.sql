-- ==============================================================================
-- SY NEXIS / X-RENT-A-CAR ENTERPRISE SECURITY HARDENING MIGRATION
-- Database: PostgreSQL / Supabase
-- ==============================================================================

-- 1. ENABLE ROW LEVEL SECURITY (RLS) ACROSS ALL PUBLIC SCHEMA TABLES
ALTER TABLE IF EXISTS public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.vehicle_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.assignments ENABLE ROW LEVEL SECURITY;

-- 2. DROP PERMISSIVE DEFAULT POLICIES IF PRESENT
DROP POLICY IF EXISTS "Public Anon Full Access Staff" ON public.staff;
DROP POLICY IF EXISTS "Public Anon Full Access Clients" ON public.clients;
DROP POLICY IF EXISTS "Public Anon Full Access Vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Public Anon Full Access Logs" ON public.activity_logs;

-- 3. SERVICE ROLE POLICIES (Backend API Full Controlled Access)
CREATE POLICY "Service Role Full Access - Staff" ON public.staff
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service Role Full Access - Clients" ON public.clients
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service Role Full Access - Vehicles" ON public.vehicles
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service Role Full Access - Logs" ON public.activity_logs
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 4. AUTHENTICATED STAFF POLICIES (JWT Context Access)
CREATE POLICY "Authenticated Read Staff" ON public.staff
    FOR SELECT TO authenticated USING (status = 'Active');

CREATE POLICY "Authenticated Read Clients" ON public.clients
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated Insert/Update Clients" ON public.clients
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated Read Vehicles" ON public.vehicles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated Insert/Update Vehicles" ON public.vehicles
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated Read/Write Logs" ON public.activity_logs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. ANONYMOUS ACCESS RESTRICTIONS
-- Block all anonymous mutations and default reads unless explicitly permitted
CREATE POLICY "Anon Deny Staff" ON public.staff
    FOR ALL TO anon USING (false);

-- 6. SENSITIVE DATA CONCEALMENT: SECURE PUBLIC VIEW FOR STAFF
-- Conceal password_hash from bulk/routine queries
CREATE OR REPLACE VIEW public.staff_secure_view AS
SELECT 
    id,
    first_name,
    last_name,
    email,
    role,
    status,
    last_login,
    created_at,
    updated_at
FROM public.staff;

-- Revoke direct table select of sensitive columns from public/anon role
REVOKE ALL ON public.staff FROM anon;
GRANT SELECT ON public.staff_secure_view TO authenticated;
GRANT SELECT ON public.staff_secure_view TO service_role;
