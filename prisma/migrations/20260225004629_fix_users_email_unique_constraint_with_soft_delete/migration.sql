-- Drop existing unique index on users email that doesn't account for soft delete
DROP INDEX "users_email_unique";

-- Create partial unique index that only applies to non-deleted users
-- This allows soft-deleted users to coexist with newly created users of the same email
CREATE UNIQUE INDEX "users_email_unique"
  ON "users"("email")
  WHERE "deleted_at" IS NULL;
