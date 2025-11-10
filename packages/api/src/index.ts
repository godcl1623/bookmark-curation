import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "../../../generated/prisma/index";
import {
  mockBookmarks,
  mockBookmarkTags,
  mockFolders,
  mockTags,
  mockUsers,
} from "./data/mock-data";
import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import {
  findBookmarksRelatedTags,
  findFolder,
  findHistory,
  findMedia,
  findParentFolder,
  findTags,
  findUser,
  getCount,
} from "@/utils";

const prisma = new PrismaClient();

// Database connection test
async function testDatabaseConnection() {
  try {
    console.log("Testing database connection...");
    await prisma.$connect();
    console.log("✓ Database connected successfully");

    // Test a simple query
    const userCount = await prisma.users.count();
    console.log(`✓ Database query successful - Users count: ${userCount}`);

    return true;
  } catch (error) {
    console.error("✗ Database connection failed:", error);
    return false;
  }
}

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true,
  }),
);
app.use(express.json());

app.get(SERVICE_ENDPOINTS.HEALTH_CHECK.SERVER.path, (_req, res) => {
  res.json({ ok: true });
});

app.get(SERVICE_ENDPOINTS.HEALTH_CHECK.DB.path, async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, database: "connected" });
  } catch (error) {
    res.status(503).json({
      ok: false,
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// API Routes for test data
app.get(SERVICE_ENDPOINTS.USERS.path, async (_req, res) => {
  // Using mock data for development
  res.json({ ok: true, data: mockUsers });

  /* DB version (for later):
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        uuid: true,
        email: true,
        display_name: true,
        avatar_url: true,
        locale: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        last_login_at: true,
      },
    });
    res.json({ ok: true, data: users });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
  */
});

app.get(SERVICE_ENDPOINTS.BOOKMARKS.ALL.path, (_req, res) => {
  // Using mock data for development - enrich bookmarks with related data
  const enrichedBookmarks = mockBookmarks.map((bookmark) => {
    const user = findUser(bookmark.user_id);
    const folder = findFolder(bookmark.parent_id);
    const bookmarkTagRelations = findBookmarksRelatedTags(bookmark.id);
    const tags = findTags(bookmarkTagRelations);
    const media = findMedia(bookmark.id);

    return {
      ...bookmark,
      users: user
        ? {
            id: user.id,
            display_name: user.display_name,
            avatar_url: user.avatar_url,
          }
        : null,
      folders: folder
        ? {
            id: folder.id,
            title: folder.title,
            color: folder.color,
          }
        : null,
      bookmark_tags: tags.map((tag) => ({ tags: tag })),
      media,
    };
  });

  res.json({ ok: true, data: enrichedBookmarks });

  /* DB version (for later):
  try {
    const bookmarks = await prisma.bookmarks.findMany({
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
        media: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    res.json({ ok: true, data: bookmarks });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
  */
});

app.get(SERVICE_ENDPOINTS.BOOKMARKS.DETAIL.path, (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ ok: false, error: "Invalid bookmark ID" });
  }

  // Using mock data for development
  const bookmark = mockBookmarks.find((b) => b.id === id);

  if (!bookmark) {
    return res.status(404).json({ ok: false, error: "Bookmark not found" });
  }

  const user = findUser(bookmark.user_id);
  const folder = findFolder(bookmark.parent_id);
  const bookmarkTagRelations = findBookmarksRelatedTags(bookmark.id);
  const tags = findTags(bookmarkTagRelations);
  const media = findMedia(bookmark.id);
  const history = findHistory(bookmark.id);

  const enrichedBookmark = {
    ...bookmark,
    users: user
      ? {
          id: user.id,
          display_name: user.display_name,
          avatar_url: user.avatar_url,
        }
      : null,
    folders: folder || null,
    bookmark_tags: tags.map((tag) => ({ tags: tag })),
    media,
    bookmark_history: history,
  };

  res.json({ ok: true, data: enrichedBookmark });

  /* DB version (for later):
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "Invalid bookmark ID" });
    }

    const bookmark = await prisma.bookmarks.findUnique({
      where: { id },
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
            created_at: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!bookmark) {
      return res.status(404).json({ ok: false, error: "Bookmark not found" });
    }

    res.json({ ok: true, data: bookmark });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
  */
});

app.get(SERVICE_ENDPOINTS.FOLDERS.path, (_req, res) => {
  // Using mock data for development
  const enrichedFolders = mockFolders.map((folder) => {
    const user = findUser(folder.user_id);
    const parentFolder = findParentFolder(folder.parent_id);
    const bookmarkCount = getCount(mockBookmarks, "parent_id", folder.id);
    const subfolderCount = getCount(mockFolders, "parent_id", folder.id);

    return {
      ...folder,
      users: user
        ? {
            id: user.id,
            display_name: user.display_name,
          }
        : null,
      folders: parentFolder
        ? {
            id: parentFolder.id,
            title: parentFolder.title,
            color: parentFolder.color,
          }
        : null,
      _count: {
        bookmarks: bookmarkCount,
        other_folders: subfolderCount,
      },
    };
  });

  res.json({ ok: true, data: enrichedFolders });

  /* DB version (for later):
  try {
    const folders = await prisma.folders.findMany({
      include: {
        users: {
          select: {
            id: true,
            display_name: true,
          },
        },
        folders: {
          select: {
            id: true,
            title: true,
            color: true,
          },
        },
        _count: {
          select: {
            bookmarks: true,
            other_folders: true,
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    });
    res.json({ ok: true, data: folders });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
  */
});

app.get(SERVICE_ENDPOINTS.TAGS.path, (_req, res) => {
  // Using mock data for development
  const enrichedTags = mockTags.map((tag) => {
    const user = findUser(tag.user_id);
    const bookmarkTagCount = getCount(mockBookmarkTags, "tag_id", tag.id);

    return {
      ...tag,
      users: user
        ? {
            id: user.id,
            display_name: user.display_name,
          }
        : null,
      _count: {
        bookmark_tags: bookmarkTagCount,
      },
    };
  });

  res.json({ ok: true, data: enrichedTags });

  /* DB version (for later):
  try {
    const tags = await prisma.tags.findMany({
      include: {
        users: {
          select: {
            id: true,
            display_name: true,
          },
        },
        _count: {
          select: {
            bookmark_tags: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    res.json({ ok: true, data: tags });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
  */
});

app.get(SERVICE_ENDPOINTS.STATS.path, (_req, res) => {
  // Using mock data for development
  res.json({
    ok: true,
    data: {
      users: mockUsers.length,
      bookmarks: mockBookmarks.length,
      folders: mockFolders.length,
      tags: mockTags.length,
    },
  });

  /* DB version (for later):
  try {
    const [userCount, bookmarkCount, folderCount, tagCount] = await Promise.all([
      prisma.users.count(),
      prisma.bookmarks.count(),
      prisma.folders.count(),
      prisma.tags.count(),
    ]);

    res.json({
      ok: true,
      data: {
        users: userCount,
        bookmarks: bookmarkCount,
        folders: folderCount,
        tags: tagCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message: "Unknown error"
    });
  }
  */
});

// Get directory contents (folders and bookmarks) by parent_id
app.get(SERVICE_ENDPOINTS.DIRECTORY.CONTENTS.path, (req, res) => {
  // parent_id from query parameter, defaults to null for root level
  const parentIdParam = req.query.parent_id;
  const parentId =
    parentIdParam === undefined || parentIdParam === "null"
      ? null
      : parentIdParam;

  // Get folders with matching parent_id
  const childFolders = mockFolders
    .filter((folder) => folder.parent_id === parentId)
    .map((folder) => {
      const user = findUser(folder.user_id);
      const bookmarkCount = getCount(mockBookmarks, "parent_id", folder.id);
      const subfolderCount = getCount(mockFolders, "parent_id", folder.id);

      return {
        ...folder,
        users: user
          ? {
              id: user.id,
              display_name: user.display_name,
            }
          : null,
        _count: {
          bookmarks: bookmarkCount,
          subfolders: subfolderCount,
        },
      };
    });

  // Get bookmarks with matching folder_id (which acts as parent_id)
  const childBookmarks = mockBookmarks
    .filter((bookmark) => bookmark.parent_id === parentId)
    .map((bookmark) => {
      const user = findUser(bookmark.user_id);
      const folder = findFolder(bookmark.parent_id);
      const bookmarkTagRelations = findBookmarksRelatedTags(bookmark.id);
      const tags = findTags(bookmarkTagRelations);
      const media = findMedia(bookmark.id);

      return {
        ...bookmark,
        users: user
          ? {
              id: user.id,
              display_name: user.display_name,
              avatar_url: user.avatar_url,
            }
          : null,
        folders: folder
          ? {
              id: folder.id,
              title: folder.title,
              color: folder.color,
            }
          : null,
        bookmark_tags: tags.map((tag) => ({ tags: tag })),
        media,
      };
    });

  res.json({
    ok: true,
    data: {
      parent_id: parentId,
      folders: childFolders,
      bookmarks: childBookmarks,
    },
  });

  /* DB version (for later):
  try {
    const parentIdParam = req.query.parent_id;
    const parentId =
      parentIdParam === undefined || parentIdParam === "null"
        ? null
        : parseInt(parentIdParam as string);

    if (parentIdParam !== undefined && parentIdParam !== "null" && isNaN(parentId as number)) {
      return res.status(400).json({ ok: false, error: "Invalid parent_id" });
    }

    const [folders, bookmarks] = await Promise.all([
      prisma.folders.findMany({
        where: { parent_id: parentId },
        include: {
          users: {
            select: {
              id: true,
              display_name: true,
            },
          },
          _count: {
            select: {
              bookmarks: true,
              other_folders: true,
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      }),
      prisma.bookmarks.findMany({
        where: { folder_id: parentId },
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
          media: true,
        },
        orderBy: {
          position: 'asc',
        },
      }),
    ]);

    res.json({
      ok: true,
      data: {
        parent_id: parentId,
        folders,
        bookmarks,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
  */
});

const PORT = process.env.PORT ?? 3001;

// Test DB connection before starting server
testDatabaseConnection().then((connected) => {
  if (!connected) {
    console.warn("⚠ Server starting without database connection");
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});
