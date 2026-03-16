-- Drop existing unique constraint that doesn't account for soft delete
-- Using ALTER TABLE instead of DROP INDEX because it's a CONSTRAINT, not just an INDEX
ALTER TABLE "folders" DROP CONSTRAINT "folders_user_parent_title_hash_unique";

-- Create partial unique index that only applies to non-deleted folders
-- This allows soft-deleted folders to coexist with newly created folders of the same name
CREATE UNIQUE INDEX "folders_user_parent_title_hash_unique"
  ON "folders"("user_id", "parent_id", "title_hash")
  WHERE "deleted_at" IS NULL;
