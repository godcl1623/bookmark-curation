import type { BookmarkQueryOption } from "./get-bookmarks-list";

const BOOKMARKS_QUERY_KEY = {
  TOTAL_LISTS: (options?: BookmarkQueryOption) => ["bookmarks", options ?? {}],
};

export default BOOKMARKS_QUERY_KEY;
