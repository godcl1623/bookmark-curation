import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "../../../generated/prisma/index";
import { SERVICE_ENDPOINTS } from "@linkvault/shared";

// Handle BigInt serialization for JSON
BigInt.prototype.toJSON = function () {
  return Number(this);
};

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

// API Routes
app.get(SERVICE_ENDPOINTS.USERS.path, async (_req, res) => {
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
});

app.get(SERVICE_ENDPOINTS.BOOKMARKS.ALL.path, async (_req, res) => {
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
});

app.get(SERVICE_ENDPOINTS.BOOKMARKS.DETAIL.path, async (req, res) => {
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
});

app.get(SERVICE_ENDPOINTS.FOLDERS.path, async (_req, res) => {
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
});

app.get(SERVICE_ENDPOINTS.TAGS.path, async (_req, res) => {
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
});

app.get(SERVICE_ENDPOINTS.STATS.path, async (_req, res) => {
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
});

// Get directory contents (folders and bookmarks) by parent_id
app.get(SERVICE_ENDPOINTS.DIRECTORY.CONTENTS.path, async (req, res) => {
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
});

// Get directory contents by path (e.g., /Development/Frontend)
app.get(SERVICE_ENDPOINTS.DIRECTORY.BY_PATH.path, async (req, res) => {
  try {
    const pathParam = req.query.path;
    const userId = 5; // TODO: Get from auth session (using first user from seed)

    if (!pathParam || typeof pathParam !== "string") {
      return res.status(400).json({ ok: false, error: "Path parameter is required" });
    }

    if (!pathParam.startsWith("/")) {
      return res.status(400).json({ ok: false, error: "Path must start with /" });
    }

    const segments = pathParam.split("/").filter(Boolean);

    // Handle root
    if (segments.length === 0) {
      const [folders, bookmarks] = await Promise.all([
        prisma.folders.findMany({
          where: { user_id: userId, parent_id: null },
          include: {
            users: { select: { id: true, display_name: true } },
            _count: { select: { bookmarks: true, other_folders: true } }
          }
        }),
        prisma.bookmarks.findMany({
          where: { user_id: userId, folder_id: null },
          include: {
            users: { select: { id: true, display_name: true, avatar_url: true } },
            folders: { select: { id: true, title: true, color: true } },
            bookmark_tags: { include: { tags: true } },
            media: true
          }
        })
      ]);

      return res.json({
        ok: true,
        data: { folder: null, folders, bookmarks, path: "/", breadcrumbs: [] }
      });
    }

    // Sequential search
    let currentParentId = null;
    const breadcrumbs = [];

    for (const title of segments) {
      const folder = await prisma.folders.findFirst({
        where: { user_id: userId, parent_id: currentParentId, title }
      });

      if (!folder) {
        return res.status(404).json({
          ok: false,
          error: `Folder not found: ${title}`,
          breadcrumbs
        });
      }

      breadcrumbs.push(folder);
      currentParentId = folder.id;
    }

    // Get contents of final folder
    const finalFolder = breadcrumbs[breadcrumbs.length - 1];
    const [folders, bookmarks] = await Promise.all([
      prisma.folders.findMany({
        where: { parent_id: finalFolder.id },
        include: {
          users: { select: { id: true, display_name: true } },
          _count: { select: { bookmarks: true, other_folders: true } }
        }
      }),
      prisma.bookmarks.findMany({
        where: { folder_id: finalFolder.id },
        include: {
          users: { select: { id: true, display_name: true, avatar_url: true } },
          folders: { select: { id: true, title: true, color: true } },
          bookmark_tags: { include: { tags: true } },
          media: true
        }
      })
    ]);

    res.json({
      ok: true,
      data: {
        folder: finalFolder,
        folders,
        bookmarks,
        path: pathParam,
        breadcrumbs
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
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
