-- ==============================================================================
-- SQL MIGRATION: Vehicle Assignments to Clients
-- Multi-Vehicle to Multi-Client Junction Architecture
-- ==============================================================================

-- 1. Create vehicle_assignments table
CREATE TABLE IF NOT EXISTS public.vehicle_assignments (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    vehicle_id BIGINT NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    daily_rate NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'Active', -- 'Active', 'Completed', 'Terminated'
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_va_client_id ON public.vehicle_assignments(client_id);
CREATE INDEX IF NOT EXISTS idx_va_vehicle_id ON public.vehicle_assignments(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_va_status ON public.vehicle_assignments(status);
CREATE INDEX IF NOT EXISTS idx_va_created_at ON public.vehicle_assignments(created_at DESC);

-- 3. Enable Row Level Security (RLS) & Public Access Policies for API
ALTER TABLE public.vehicle_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to vehicle_assignments"
    ON public.vehicle_assignments FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert access to vehicle_assignments"
    ON public.vehicle_assignments FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update access to vehicle_assignments"
    ON public.vehicle_assignments FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete access to vehicle_assignments"
    ON public.vehicle_assignments FOR DELETE
    USING (true);

-- 4. Sample Assignment Data (Optional verification seed)
-- Inserts sample link between first available client and vehicle if available
DO $$
DECLARE
    v_client_id BIGINT;
    v_vehicle_id BIGINT;
BEGIN
    SELECT id INTO v_client_id FROM public.clients ORDER BY id ASC LIMIT 1;
    SELECT id INTO v_vehicle_id FROM public.vehicles WHERE status = 'Available' OR status = 'Active' ORDER BY id ASC LIMIT 1;

    IF v_client_id IS NOT NULL AND v_vehicle_id IS NOT NULL THEN
        INSERT INTO public.vehicle_assignments (client_id, vehicle_id, daily_rate, status, notes)
        VALUES (v_client_id, v_vehicle_id, 18500.00, 'Active', 'Corporate logistics contract')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
