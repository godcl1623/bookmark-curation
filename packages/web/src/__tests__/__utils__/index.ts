import type { Bookmark, Folder, Tag } from "@linkvault/shared";

interface Examples {
  BOOKMARK: Bookmark;
  FOLDER: Folder;
  TAG: Tag;
}

export const EXAMPLES: Examples = {
  BOOKMARK: {
    data_id: "1",
    title: "title",
    url: "url",
    description: "description",
    metadata: {},
    parent_id: null,
    domain: "",
    favicon_url: "",
    preview_image: "",
    is_favorite: false,
    is_archived: false,
    is_private: false,
    type: "bookmark",
    folders: null,
    click_count: 0,
    created_at: "",
    deleted_at: "",
    id: 1,
    parent: null,
    position: 0,
    tags: [],
    updated_at: "",
    user_id: 1,
    view_count: 0,
    users: { id: 1, display_name: "user" },
    _count: { bookmarks: 0, children: 0 },
  },
  FOLDER: {
    _count: { bookmarks: 0, children: 0 },
    created_at: "",
    data_id: "1",
    deleted_at: "",
    id: 1,
    parent: null,
    parent_id: null,
    position: 0,
    title: "folder",
    type: "folder",
    updated_at: "",
    user_id: 1,
    users: { display_name: "user", id: 1 },
  },
  TAG: {
    name: "tag",
    color: "#000000",
    created_at: "",
    deleted_at: "",
    id: 1,
    slug: "tag",
    updated_at: "",
    user_id: 1,
    users: { id: 1, display_name: "user" },
    _count: { bookmark_tags: 0 },
  },
};

export const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3002";
