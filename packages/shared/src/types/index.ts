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
  id: number;
  data_id: string;
  user_id: number;
  title: string;
  color?: string;
  parent_id: string | null;
  position: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  type: DataType;
}

export interface Tag {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  color: string;
  created_at: string;
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
