export interface User {
  id: number;
  uuid: string;
  email: string;
  email_verified: boolean;
  display_name: string;
  avatar_url: string;
  locale: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export type DataType = "folder" | "bookmark";

export interface Folder {
  color?: string;
  created_at: string;
  data_id: string;
  deleted_at: string | null;
  id: number;
  parent: { id: number; title: string; color: string } | null;
  parent_id: string | null;
  position: number;
  title: string;
  type: DataType;
  updated_at: string;
  user_id: number;
  users: { id: number; display_name: string };
  _count: { bookmarks: number; children: number };
}

export interface Tag {
  color: string;
  created_at: string;
  deleted_at: string;
  id: number;
  name: string;
  slug: string;
  updated_at: string;
  user_id: number;
  users: { id: number; display_name: string };
  _count: { bookmark_tags: number };
}

export interface Bookmark extends Folder {
  description: string | null;
  url: string;
  domain: string;
  favicon_url: string | null;
  preview_image: string | null;
  metadata: Record<string, any>;
  is_favorite: boolean;
  is_archived: boolean;
  is_private: boolean;
  view_count: number;
  click_count: number;
  type: DataType;
}

export interface BookmarkTag {
  bookmark_id: number;
  tag_id: number;
  user_id: number;
}

export interface Media {
  id: number;
  bookmark_id: number;
  type: string;
  url: string;
  width: number | null;
  height: number | null;
  created_at: string;
}

export interface BookmarkHistory {
  id: number;
  bookmark_id: number;
  user_id: number;
  action: string;
  payload: Record<string, any>;
  created_at: string;
}
