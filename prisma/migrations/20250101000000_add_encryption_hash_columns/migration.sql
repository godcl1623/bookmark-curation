-- Add hash columns for encrypted searchable fields
ALTER TABLE "app"."bookmarks" ADD COLUMN IF NOT EXISTS "title_hash" VARCHAR(64);
ALTER TABLE "app"."bookmarks" ADD COLUMN IF NOT EXISTS "url_hash" VARCHAR(64);

ALTER TABLE "app"."folders" ADD COLUMN IF NOT EXISTS "title_hash" VARCHAR(64);

ALTER TABLE "app"."tags" ADD COLUMN IF NOT EXISTS "name_hash" VARCHAR(64);

ALTER TABLE "app"."users" ADD COLUMN IF NOT EXISTS "display_name_hash" VARCHAR(64);

-- Drop old index
DROP INDEX IF EXISTS "app"."idx_bookmarks_user_title";

-- Add new indexes for hash columns
CREATE INDEX IF NOT EXISTS "idx_bookmarks_title_hash" ON "app"."bookmarks"("title_hash");
CREATE INDEX IF NOT EXISTS "idx_bookmarks_url_hash" ON "app"."bookmarks"("url_hash");
CREATE INDEX IF NOT EXISTS "idx_folders_title_hash" ON "app"."folders"("title_hash");
CREATE INDEX IF NOT EXISTS "idx_tags_name_hash" ON "app"."tags"("name_hash");

-- Drop old unique constraint on folders
ALTER TABLE "app"."folders" DROP CONSTRAINT IF EXISTS "folders_user_parent_title_unique";

-- Add new unique constraint with title_hash (will be enforced after encryption)
-- Note: This will be added after data encryption to avoid conflicts
-- ALTER TABLE "app"."folders" ADD CONSTRAINT "folders_user_parent_title_hash_unique" UNIQUE ("user_id", "parent_id", "title_hash");
