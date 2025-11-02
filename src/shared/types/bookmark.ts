export interface Bookmark {
  id: string;
  type: BookmarkType;
  parent: string | null;
  name: string;
  children?: Bookmark[];
}

export type BookmarkType = "folder" | "bookmark";
