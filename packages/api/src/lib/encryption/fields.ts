import { encrypt, decrypt, createSearchHash, encryptJSON, decryptJSON } from "./index";

export interface EncryptedBookmarkData {
  title?: string | null;
  title_hash?: string | null;
  url: string;
  url_hash?: string | null;
  description?: string | null;
  metadata?: string | null;
}

export interface DecryptedBookmarkData {
  title?: string | null;
  url: string;
  description?: string | null;
  metadata?: any;
}

export function encryptBookmarkFields(data: {
  title?: string | null;
  url: string;
  description?: string | null;
  metadata?: any;
}): EncryptedBookmarkData {
  return {
    title: data.title ? encrypt(data.title) : null,
    title_hash: data.title ? createSearchHash(data.title) : null,
    url: encrypt(data.url)!,
    url_hash: createSearchHash(data.url)!,
    description: data.description ? encrypt(data.description) : null,
    metadata: data.metadata ? encryptJSON(data.metadata) : null,
  };
}

export function decryptBookmarkFields(data: {
  title?: string | null;
  url: string;
  description?: string | null;
  metadata?: string | null;
}): DecryptedBookmarkData {
  return {
    title: data.title ? decrypt(data.title) : null,
    url: decrypt(data.url)!,
    description: data.description ? decrypt(data.description) : null,
    metadata: data.metadata ? decryptJSON(data.metadata) : null,
  };
}

export interface EncryptedFolderData {
  title: string;
  title_hash?: string | null;
}

export interface DecryptedFolderData {
  title: string;
}

export function encryptFolderFields(data: { title: string }): EncryptedFolderData {
  return {
    title: encrypt(data.title)!,
    title_hash: createSearchHash(data.title),
  };
}

export function decryptFolderFields(data: { title: string }): DecryptedFolderData {
  return {
    title: decrypt(data.title)!,
  };
}

export interface EncryptedTagData {
  name: string;
  name_hash?: string | null;
  slug: string;
}

export interface DecryptedTagData {
  name: string;
  slug: string;
}

export function encryptTagFields(data: {
  name: string;
  slug: string;
}): EncryptedTagData {
  return {
    name: encrypt(data.name)!,
    name_hash: createSearchHash(data.name),
    slug: data.slug,
  };
}

export function decryptTagFields(data: {
  name: string;
  slug: string;
}): DecryptedTagData {
  return {
    name: decrypt(data.name)!,
    slug: data.slug,
  };
}

export interface EncryptedUserData {
  email?: string | null;
  display_name?: string | null;
  display_name_hash?: string | null;
}

export interface DecryptedUserData {
  email?: string | null;
  display_name?: string | null;
}

export function encryptUserFields(data: {
  email?: string | null;
  display_name?: string | null;
}): EncryptedUserData {
  return {
    email: data.email ? encrypt(data.email) : null,
    display_name: data.display_name ? encrypt(data.display_name) : null,
    display_name_hash: data.display_name
      ? createSearchHash(data.display_name)
      : null,
  };
}

export function decryptUserFields(data: {
  email?: string | null;
  display_name?: string | null;
}): DecryptedUserData {
  return {
    email: data.email ? decrypt(data.email) : null,
    display_name: data.display_name ? decrypt(data.display_name) : null,
  };
}
