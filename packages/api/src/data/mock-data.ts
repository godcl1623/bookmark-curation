// Mock data types
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

export interface Folder {
  id: number;
  user_id: number;
  name: string;
  color: string;
  parent_id: number | null;
  position: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Tag {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  color: string;
  created_at: string;
}

export interface Bookmark {
  id: number;
  user_id: number;
  folder_id: number | null;
  title: string;
  description: string | null;
  url: string;
  domain: string;
  favicon_url: string | null;
  preview_image: string | null;
  metadata: Record<string, any>;
  is_favorite: boolean;
  is_archived: boolean;
  is_private: boolean;
  position: number;
  view_count: number;
  click_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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

// Mock Users
export const mockUsers: User[] = [
  {
    id: 1,
    uuid: '550e8400-e29b-41d4-a716-446655440001',
    email: 'test1@example.com',
    email_verified: true,
    display_name: 'Test User 1',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test1',
    locale: 'ko',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    last_login_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    uuid: '550e8400-e29b-41d4-a716-446655440002',
    email: 'test2@example.com',
    email_verified: true,
    display_name: 'Test User 2',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test2',
    locale: 'en',
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    last_login_at: null,
  },
];

// Mock Folders
export const mockFolders: Folder[] = [
  {
    id: 1,
    user_id: 1,
    name: 'Development',
    color: '#3b82f6',
    parent_id: null,
    position: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 2,
    user_id: 1,
    name: 'Design',
    color: '#ec4899',
    parent_id: null,
    position: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 3,
    user_id: 1,
    name: 'Frontend',
    color: '#10b981',
    parent_id: 1,
    position: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 4,
    user_id: 2,
    name: 'Resources',
    color: '#f59e0b',
    parent_id: null,
    position: 0,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    deleted_at: null,
  },
];

// Mock Tags
export const mockTags: Tag[] = [
  {
    id: 1,
    user_id: 1,
    name: 'JavaScript',
    slug: 'javascript',
    color: '#f7df1e',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    user_id: 1,
    name: 'React',
    slug: 'react',
    color: '#61dafb',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    user_id: 1,
    name: 'TypeScript',
    slug: 'typescript',
    color: '#3178c6',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    user_id: 1,
    name: 'UI/UX',
    slug: 'ui-ux',
    color: '#ff6b6b',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    user_id: 2,
    name: 'Tutorial',
    slug: 'tutorial',
    color: '#4ecdc4',
    created_at: '2024-01-02T00:00:00Z',
  },
];

// Mock Bookmarks
export const mockBookmarks: Bookmark[] = [
  {
    id: 1,
    user_id: 1,
    folder_id: 3,
    title: 'React Documentation',
    description: 'Official React documentation - Learn React',
    url: 'https://react.dev/',
    domain: 'react.dev',
    favicon_url: 'https://react.dev/favicon.ico',
    preview_image: 'https://react.dev/images/og-home.png',
    metadata: {
      author: 'React Team',
      keywords: ['react', 'javascript', 'library'],
    },
    is_favorite: true,
    is_archived: false,
    is_private: false,
    position: 0,
    view_count: 42,
    click_count: 15,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 2,
    user_id: 1,
    folder_id: 3,
    title: 'TypeScript Handbook',
    description: 'The TypeScript Handbook is a comprehensive guide to TypeScript',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    domain: 'typescriptlang.org',
    favicon_url: 'https://www.typescriptlang.org/favicon.ico',
    preview_image: null,
    metadata: {},
    is_favorite: true,
    is_archived: false,
    is_private: false,
    position: 1,
    view_count: 28,
    click_count: 10,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 3,
    user_id: 1,
    folder_id: 2,
    title: 'Figma',
    description: 'The collaborative interface design tool',
    url: 'https://www.figma.com/',
    domain: 'figma.com',
    favicon_url: 'https://www.figma.com/favicon.ico',
    preview_image: null,
    metadata: {},
    is_favorite: false,
    is_archived: false,
    is_private: false,
    position: 0,
    view_count: 15,
    click_count: 8,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 4,
    user_id: 1,
    folder_id: 1,
    title: 'MDN Web Docs',
    description: 'Resources for developers, by developers',
    url: 'https://developer.mozilla.org/',
    domain: 'developer.mozilla.org',
    favicon_url: 'https://developer.mozilla.org/favicon.ico',
    preview_image: null,
    metadata: {},
    is_favorite: false,
    is_archived: false,
    is_private: true,
    position: 0,
    view_count: 67,
    click_count: 23,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 5,
    user_id: 2,
    folder_id: 4,
    title: 'GitHub',
    description: 'Where the world builds software',
    url: 'https://github.com/',
    domain: 'github.com',
    favicon_url: 'https://github.com/favicon.ico',
    preview_image: null,
    metadata: {},
    is_favorite: true,
    is_archived: false,
    is_private: false,
    position: 0,
    view_count: 89,
    click_count: 34,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 6,
    user_id: 1,
    folder_id: null,
    title: 'Stack Overflow',
    description: 'Where developers learn, share, & build careers',
    url: 'https://stackoverflow.com/',
    domain: 'stackoverflow.com',
    favicon_url: 'https://stackoverflow.com/favicon.ico',
    preview_image: null,
    metadata: {},
    is_favorite: false,
    is_archived: true,
    is_private: false,
    position: 0,
    view_count: 103,
    click_count: 45,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
    deleted_at: null,
  },
];

// Mock Bookmark Tags
export const mockBookmarkTags: BookmarkTag[] = [
  { bookmark_id: 1, tag_id: 2, user_id: 1 },
  { bookmark_id: 1, tag_id: 1, user_id: 1 },
  { bookmark_id: 2, tag_id: 3, user_id: 1 },
  { bookmark_id: 2, tag_id: 1, user_id: 1 },
  { bookmark_id: 3, tag_id: 4, user_id: 1 },
  { bookmark_id: 4, tag_id: 1, user_id: 1 },
  { bookmark_id: 5, tag_id: 5, user_id: 2 },
];

// Mock Media
export const mockMedia: Media[] = [
  {
    id: 1,
    bookmark_id: 1,
    type: 'image',
    url: 'https://react.dev/images/og-home.png',
    width: 1200,
    height: 630,
    created_at: '2024-01-03T00:00:00Z',
  },
  {
    id: 2,
    bookmark_id: 3,
    type: 'image',
    url: 'https://www.figma.com/og-image.png',
    width: 1200,
    height: 630,
    created_at: '2024-01-04T00:00:00Z',
  },
];

// Mock Bookmark History
export const mockBookmarkHistory: BookmarkHistory[] = [
  {
    id: 1,
    bookmark_id: 1,
    user_id: 1,
    action: 'created',
    payload: { source: 'manual' },
    created_at: '2024-01-03T00:00:00Z',
  },
  {
    id: 2,
    bookmark_id: 1,
    user_id: 1,
    action: 'updated',
    payload: { field: 'title', old: 'React Docs', new: 'React Documentation' },
    created_at: '2024-01-03T01:00:00Z',
  },
  {
    id: 3,
    bookmark_id: 1,
    user_id: 1,
    action: 'viewed',
    payload: { timestamp: '2024-01-10T10:30:00Z' },
    created_at: '2024-01-10T10:30:00Z',
  },
  {
    id: 4,
    bookmark_id: 2,
    user_id: 1,
    action: 'created',
    payload: { source: 'import' },
    created_at: '2024-01-03T00:00:00Z',
  },
  {
    id: 5,
    bookmark_id: 6,
    user_id: 1,
    action: 'archived',
    payload: { reason: 'not_used' },
    created_at: '2024-01-12T00:00:00Z',
  },
];