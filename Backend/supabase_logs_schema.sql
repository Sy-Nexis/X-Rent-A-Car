-- ==============================================================================
-- SQL MIGRATION: Activity / Audit Logs Table
-- Tracks what the logged-in person has done with name, role, action, and timestamp
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL DEFAULT 'System Admin',
    user_role VARCHAR(100) DEFAULT 'Fleet Manager',
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL, -- e.g. 'Assigned Vehicles', 'Created Vehicle', 'Updated Client', 'Deleted Vehicle', 'Returned Vehicle', 'Login'
    entity_type VARCHAR(100) NOT NULL, -- 'Assignment', 'Vehicle', 'Client', 'Auth', 'Fleet'
    entity_id VARCHAR(255),
    details TEXT NOT NULL,
    ip_address VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_audit_user_name ON public.audit_logs(user_name);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_entity_type ON public.audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.audit_logs(created_at DESC);

-- Enable Row Level Security (RLS) & Public Access Policies
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to audit_logs"
    ON public.audit_logs FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert access to audit_logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public delete access to audit_logs"
    ON public.audit_logs FOR DELETE
    USING (true);

-- Insert initial demonstration audit logs
INSERT INTO public.audit_logs (user_name, user_role, action, entity_type, details, created_at)
VALUES 
    ('Alex Rivera', 'Fleet Manager', 'Login', 'Auth', 'User logged into neXus Fleet Control Portal successfully.', NOW() - INTERVAL '3 hours'),
    ('Alex Rivera', 'Fleet Manager', 'Assigned Vehicles', 'Assignment', 'Dispatched multi-vehicle corporate contract to clients with active status.', NOW() - INTERVAL '2 hours'),
    ('Alex Rivera', 'Fleet Manager', 'Updated Client', 'Client', 'Updated contact and licensing verification records in registry.', NOW() - INTERVAL '1 hour'),
    ('Alex Rivera', 'Fleet Manager', 'Registered Vehicle', 'Vehicle', 'Added new Toyota Land Cruiser Prado to active fleet database.', NOW() - INTERVAL '35 minutes')
ON CONFLICT DO NOTHING;
