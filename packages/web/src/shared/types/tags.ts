export interface TagQueryOption {
  search?: string;
  sort_by?: SortBy;
  limit?: number;
}

export type SortBy = "count";
