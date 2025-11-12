import {
  mockBookmarkHistory,
  mockBookmarkTags,
  mockFolders,
  mockMedia,
  mockTags,
  mockUsers,
} from "@/data/mock-data";
import type { BookmarkTag } from "@linkvault/shared/types";

export const findUser = (bookmarkUserId: number) =>
  mockUsers.find((user) => user.id === bookmarkUserId);

export const findFolder = (folderId: string | null) =>
  mockFolders.find((folder) => folder.data_id === folderId);

export const findBookmarksRelatedTags = (bookmarkId: number) =>
  mockBookmarkTags.filter(
    (bookmarkTags) => bookmarkTags.bookmark_id === bookmarkId,
  );

export const findTags = (relatedTags: BookmarkTag[]) =>
  relatedTags
    .map((bookmarkTag) => mockTags.find((tag) => tag.id === bookmarkTag.tag_id))
    .filter(Boolean);

export const findMedia = (bookmarkId: number) =>
  mockMedia.filter((media) => media.bookmark_id === bookmarkId);

export const findHistory = (bookmarkId: number) =>
  mockBookmarkHistory
    .filter((history) => history.bookmark_id === bookmarkId)
    .slice(0, 10);

export const findParentFolder = (folderParentId: string | null) =>
  folderParentId
    ? mockFolders.find((folder) => folder.data_id === folderParentId)
    : null;

export const getCount = <T>(
  targets: Array<T>,
  targetProperty: keyof T,
  folderId: string | number,
) => targets.filter((target) => target[targetProperty] === folderId).length;
