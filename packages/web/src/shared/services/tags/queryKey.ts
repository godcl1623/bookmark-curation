import type { TagQueryOption } from "@/shared/types";

const TAGS_QUERY_KEY = {
  TOTAL_LISTS: (options: TagQueryOption) => ["tags", options],
};

export default TAGS_QUERY_KEY;
