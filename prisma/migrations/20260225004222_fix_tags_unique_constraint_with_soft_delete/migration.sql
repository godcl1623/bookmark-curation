-- Drop existing unique index on tags that doesn't account for soft delete
DROP INDEX "tags_user_slug_unique";

-- Create partial unique index that only applies to non-deleted tags
-- This allows soft-deleted tags to coexist with newly created tags of the same slug
CREATE UNIQUE INDEX "tags_user_slug_unique"
  ON "tags"("user_id", "slug")
  WHERE "deleted_at" IS NULL;
