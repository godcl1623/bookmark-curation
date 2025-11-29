-- This script is automatically executed when the PostgreSQL container starts
-- It sets up the 'app' schema and grants necessary permissions to linkvault_app user

-- Create the app schema (project uses 'app' schema instead of 'public')
CREATE SCHEMA IF NOT EXISTS app;

-- Grant ownership of the app schema to linkvault_app user
ALTER SCHEMA app OWNER TO linkvault_app;

-- Grant all privileges on the app schema
GRANT ALL PRIVILEGES ON SCHEMA app TO linkvault_app;

-- Grant all privileges on the public schema (for system operations)
GRANT ALL PRIVILEGES ON SCHEMA public TO linkvault_app;

-- Set default privileges for future tables created in the app schema
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON TABLES TO linkvault_app;

-- Set default privileges for future sequences (for auto-increment IDs)
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON SEQUENCES TO linkvault_app;

-- Set default privileges for future functions
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON FUNCTIONS TO linkvault_app;

-- Ensure the user can create databases (needed for Prisma shadow database)
-- Note: In production, you may want to remove this permission
ALTER USER linkvault_app CREATEDB;
