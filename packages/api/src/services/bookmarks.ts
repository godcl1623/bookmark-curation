import prisma from "../lib/prisma";
import { encrypt, decrypt, createSearchHash, encryptJSON, decryptJSON } from "../lib/encryption";

interface BookmarkInclude {
  users?: boolean | object;
  folders?: boolean | object;
  bookmark_tags?: boolean | object;
  media?: boolean;
  bookmark_history?: boolean | object;
}

function decryptBookmark(bookmark: any): any {
  if (!bookmark) return null;

  const decrypted = {
    ...bookmark,
    title: bookmark.title ? decrypt(bookmark.title) : null,
    url: decrypt(bookmark.url),
    description: bookmark.description ? decrypt(bookmark.description) : null,
    metadata: bookmark.metadata ? decryptJSON(bookmark.metadata) : null,
  };

  if (decrypted.users) {
    decrypted.users = {
      ...decrypted.users,
      display_name: decrypted.users.display_name
        ? decrypt(decrypted.users.display_name)
        : null,
      email: decrypted.users.email ? decrypt(decrypted.users.email) : null,
    };
  }

  if (decrypted.folders) {
    decrypted.folders = {
      ...decrypted.folders,
      title: decrypt(decrypted.folders.title),
    };
  }

  if (decrypted.bookmark_tags) {
    decrypted.bookmark_tags = decrypted.bookmark_tags.map((bt: any) => ({
      ...bt,
      tags: bt.tags
        ? {
            ...bt.tags,
            name: decrypt(bt.tags.name),
          }
        : bt.tags,
    }));
  }

  return decrypted;
}

export async function getAllBookmarks(
  userId: number,
  searchTerm?: string,
  include?: BookmarkInclude
) {
  const defaultInclude: BookmarkInclude = {
    users: {
      select: {
        id: true,
        display_name: true,
        avatar_url: true,
      },
    },
    folders: {
      select: {
        id: true,
        title: true,
        color: true,
      },
    },
    bookmark_tags: {
      include: {
        tags: true,
      },
    },
    media: true,
  };

  let bookmarks: any[];

  if (searchTerm && searchTerm.trim() !== "") {
    const searchHash = createSearchHash(searchTerm);

    const candidates = await prisma.bookmarks.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
        OR: [
          { title_hash: searchHash },
          { url_hash: searchHash },
          {
            domain: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            bookmark_tags: {
              some: {
                tags: {
                  name_hash: searchHash,
                  deleted_at: null,
                },
              },
            },
          },
        ],
      },
      include: include || defaultInclude,
      take: 1000,
      orderBy: {
        created_at: "desc",
      },
    });

    if (candidates.length > 0) {
      const decryptedCandidates = candidates.map(decryptBookmark);
      bookmarks = decryptedCandidates.filter((b: any) => {
        const titleMatch =
          b.title && b.title.toLowerCase().includes(searchTerm.toLowerCase());
        const urlMatch = b.url && b.url.toLowerCase().includes(searchTerm.toLowerCase());
        const descMatch =
          b.description &&
          b.description.toLowerCase().includes(searchTerm.toLowerCase());
        const domainMatch =
          b.domain && b.domain.toLowerCase().includes(searchTerm.toLowerCase());
        const tagMatch =
          b.bookmark_tags &&
          b.bookmark_tags.some((bt: any) =>
            bt.tags && bt.tags.name && bt.tags.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

        return titleMatch || urlMatch || descMatch || domainMatch || tagMatch;
      });
    } else {
      const allBookmarks = await prisma.bookmarks.findMany({
        where: {
          user_id: userId,
          deleted_at: null,
        },
        include: include || defaultInclude,
        take: 1000,
        orderBy: {
          created_at: "desc",
        },
      });

      const decryptedAll = allBookmarks.map(decryptBookmark);
      bookmarks = decryptedAll.filter((b: any) => {
        const titleMatch =
          b.title && b.title.toLowerCase().includes(searchTerm.toLowerCase());
        const urlMatch = b.url && b.url.toLowerCase().includes(searchTerm.toLowerCase());
        const descMatch =
          b.description &&
          b.description.toLowerCase().includes(searchTerm.toLowerCase());
        const tagMatch =
          b.bookmark_tags &&
          b.bookmark_tags.some((bt: any) =>
            bt.tags && bt.tags.name && bt.tags.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

        return titleMatch || urlMatch || descMatch || tagMatch;
      });
    }
  } else {
    const results = await prisma.bookmarks.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
      },
      include: include || defaultInclude,
      orderBy: {
        created_at: "desc",
      },
    });

    bookmarks = results.map(decryptBookmark);
  }

  return bookmarks.map((bookmark) => {
    const { bookmark_tags, ...rest } = bookmark;
    return {
      ...rest,
      tags: bookmark_tags ? bookmark_tags.map((bt: any) => bt.tags) : [],
    };
  });
}

export async function getBookmarkById(userId: number, bookmarkId: number) {
  const bookmark = await prisma.bookmarks.findFirst({
    where: { id: bookmarkId, user_id: userId, deleted_at: null },
    include: {
      users: {
        select: {
          id: true,
          display_name: true,
          avatar_url: true,
        },
      },
      folders: true,
      bookmark_tags: {
        include: {
          tags: true,
        },
      },
      media: true,
      bookmark_history: {
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  if (!bookmark) {
    return null;
  }

  const decrypted = decryptBookmark(bookmark);

  const { bookmark_tags, ...rest } = decrypted;
  return {
    ...rest,
    tags: bookmark_tags ? bookmark_tags.map((bt: any) => bt.tags) : [],
  };
}

export async function createBookmark(
  userId: number,
  data: {
    data_id: string;
    title?: string;
    url: string;
    description?: string;
    metadata?: any;
    folder_id?: number;
    parent_id?: string;
    domain?: string;
    favicon_url?: string;
    preview_image?: string;
    is_favorite?: boolean;
    is_archived?: boolean;
    is_private?: boolean;
    position?: number;
    type?: string;
    tag_ids?: number[];
  }
) {
  const {
    tag_ids,
    folder_id,
    parent_id,
    title,
    url,
    description,
    metadata,
    ...restData
  } = data;

  let folderId: number | null = null;
  if (folder_id) {
    const folder = await prisma.folders.findFirst({
      where: { id: folder_id, user_id: userId, deleted_at: null },
    });
    if (!folder) {
      throw new Error("Folder not found or access denied");
    }
    folderId = folder.id;
  }

  const maxPositionBookmark = await prisma.bookmarks.findFirst({
    where: {
      user_id: userId,
      folder_id: folderId,
    },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const newPosition = data.position ?? (maxPositionBookmark?.position ?? -1) + 1;

  const bookmark = await prisma.bookmarks.create({
    data: {
      ...restData,
      user_id: userId,
      folder_id: folderId,
      parent_id: parent_id || null,
      title: title ? encrypt(title) : null,
      title_hash: title ? createSearchHash(title) : null,
      url: encrypt(url)!,
      url_hash: createSearchHash(url)!,
      description: description ? encrypt(description) : null,
      metadata: metadata ? (encryptJSON(metadata) as any) : null,
      position: newPosition,
    },
    include: {
      users: {
        select: {
          id: true,
          display_name: true,
          avatar_url: true,
        },
      },
      folders: {
        select: {
          id: true,
          title: true,
          color: true,
        },
      },
    },
  });

  if (tag_ids && tag_ids.length > 0) {
    await prisma.bookmark_tags.createMany({
      data: tag_ids.map((tag_id) => ({
        bookmark_id: bookmark.id,
        tag_id,
        user_id: userId,
      })),
    });
  }

  const createdBookmark = await prisma.bookmarks.findUnique({
    where: { id: bookmark.id },
    include: {
      users: {
        select: {
          id: true,
          display_name: true,
          avatar_url: true,
        },
      },
      folders: {
        select: {
          id: true,
          title: true,
          color: true,
        },
      },
      bookmark_tags: {
        include: {
          tags: true,
        },
      },
    },
  });

  const decrypted = decryptBookmark(createdBookmark);
  const { bookmark_tags, ...rest } = decrypted;

  return {
    ...rest,
    tags: bookmark_tags ? bookmark_tags.map((bt: any) => bt.tags) : [],
  };
}

export async function updateBookmark(
  userId: number,
  bookmarkId: number,
  data: {
    title?: string;
    url?: string;
    description?: string;
    metadata?: any;
    folder_id?: number;
    parent_id?: string;
    domain?: string;
    favicon_url?: string;
    preview_image?: string;
    is_favorite?: boolean;
    is_archived?: boolean;
    is_private?: boolean;
    position?: number;
    type?: string;
    tag_ids?: number[];
  }
) {
  const existingBookmark = await prisma.bookmarks.findFirst({
    where: { id: bookmarkId, user_id: userId, deleted_at: null },
  });

  if (!existingBookmark) {
    throw new Error("Bookmark not found or access denied");
  }

  const { tag_ids, folder_id, title, url, description, metadata, ...restData } = data;

  const updateData: any = {
    ...restData,
    updated_at: new Date(),
  };

  if (title !== undefined) {
    updateData.title = title ? encrypt(title) : null;
    updateData.title_hash = title ? createSearchHash(title) : null;
  }

  if (url !== undefined) {
    updateData.url = encrypt(url)!;
    updateData.url_hash = createSearchHash(url)!;
  }

  if (description !== undefined) {
    updateData.description = description ? encrypt(description) : null;
  }

  if (metadata !== undefined) {
    updateData.metadata = metadata ? (encryptJSON(metadata) as any) : null;
  }

  if (folder_id !== undefined) {
    if (folder_id === null) {
      updateData.folder_id = null;
    } else {
      const folder = await prisma.folders.findFirst({
        where: { id: folder_id, user_id: userId, deleted_at: null },
      });
      if (!folder) {
        throw new Error("Folder not found or access denied");
      }
      updateData.folder_id = folder.id;
    }
  }

  await prisma.bookmarks.update({
    where: { id: bookmarkId },
    data: updateData,
  });

  if (tag_ids !== undefined) {
    await prisma.bookmark_tags.deleteMany({
      where: { bookmark_id: bookmarkId },
    });

    if (tag_ids.length > 0) {
      await prisma.bookmark_tags.createMany({
        data: tag_ids.map((tag_id) => ({
          bookmark_id: bookmarkId,
          tag_id,
          user_id: userId,
        })),
      });
    }
  }

  const updatedBookmark = await prisma.bookmarks.findUnique({
    where: { id: bookmarkId },
    include: {
      users: {
        select: {
          id: true,
          display_name: true,
          avatar_url: true,
        },
      },
      folders: {
        select: {
          id: true,
          title: true,
          color: true,
        },
      },
      bookmark_tags: {
        include: {
          tags: true,
        },
      },
    },
  });

  const decrypted = decryptBookmark(updatedBookmark);
  const { bookmark_tags, ...rest } = decrypted;

  return {
    ...rest,
    tags: bookmark_tags ? bookmark_tags.map((bt: any) => bt.tags) : [],
  };
}

export async function deleteBookmark(userId: number, bookmarkId: number) {
  const existingBookmark = await prisma.bookmarks.findFirst({
    where: { id: bookmarkId, user_id: userId, deleted_at: null },
  });

  if (!existingBookmark) {
    throw new Error("Bookmark not found or access denied");
  }

  const bookmark = await prisma.bookmarks.update({
    where: { id: bookmarkId },
    data: {
      deleted_at: new Date(),
    },
  });

  return decryptBookmark(bookmark);
}
