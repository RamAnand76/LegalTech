-- Create version table if it doesn't exist
CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check if this migration has been applied
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM schema_migrations WHERE version = '20240314000000') THEN
        -- Drop existing table if it exists
        DROP TABLE IF EXISTS contract_reviews;

        -- Create contract_reviews table with correct schema
        CREATE TABLE contract_reviews (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ
        );

        -- Add indexes
        CREATE INDEX idx_contract_reviews_contract_id ON contract_reviews(contract_id);
        CREATE INDEX idx_contract_reviews_created_at ON contract_reviews(created_at);

        -- Record migration
        INSERT INTO schema_migrations (version) VALUES ('20240314000000');
    END IF;
END $$;
