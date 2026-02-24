-- Drop existing unique index on bookmarks that doesn't account for soft delete
DROP INDEX "bookmarks_data_id_key";

-- Create partial unique index that only applies to non-deleted bookmarks
-- This allows soft-deleted bookmarks to coexist with newly created bookmarks of the same data_id
CREATE UNIQUE INDEX "bookmarks_data_id_key"
  ON "bookmarks"("data_id")
  WHERE "deleted_at" IS NULL;
