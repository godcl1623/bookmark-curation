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
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get(SERVICE_ENDPOINTS.BOOKMARKS.ALL.path, async (_req, res) => {
  try {
    const bookmarks = await prisma.bookmarks.findMany({
      where: {
        deleted_at: null,
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
        bookmark_tags: {
          include: {
            tags: true,
          },
        },
        media: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.json({ ok: true, data: bookmarks });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get(SERVICE_ENDPOINTS.BOOKMARKS.DETAIL.path, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "Invalid bookmark ID" });
    }

    const bookmark = await prisma.bookmarks.findFirst({
      where: { id, deleted_at: null },
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
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get(SERVICE_ENDPOINTS.FOLDERS.path, async (_req, res) => {
  try {
    const folders = await prisma.folders.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        users: {
          select: {
            id: true,
            display_name: true,
          },
        },
        parent: {
          select: {
            id: true,
            title: true,
            color: true,
          },
        },
        _count: {
          select: {
            bookmarks: true,
            children: true,
          },
        },
      },
      orderBy: {
        position: "asc",
      },
    });
    res.json({ ok: true, data: folders });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create a new folder
app.post(SERVICE_ENDPOINTS.FOLDERS.path, async (req, res) => {
  try {
    const { data_id, title, color, parent_id } = req.body;
    const userId = 1; // TODO: Get from auth session

    // Validate required fields
    if (!data_id || !title) {
      return res.status(400).json({
        ok: false,
        error: "data_id and title are required",
      });
    }

    // Find parent folder by data_id if parent_id is provided
    let parentFolderId: number | null = null;
    if (parent_id) {
      const parentFolder = await prisma.folders.findFirst({
        where: {
          data_id: parent_id,
          user_id: userId,
        },
        select: {
          id: true,
        },
      });

      if (!parentFolder) {
        return res.status(404).json({
          ok: false,
          error: "Parent folder not found",
        });
      }

      parentFolderId = parentFolder.id;
    }

    // Get the highest position in the same parent to append the new folder at the end
    const maxPositionFolder = await prisma.folders.findFirst({
      where: {
        user_id: userId,
        parent_id: parentFolderId,
      },
      orderBy: {
        position: "desc",
      },
      select: {
        position: true,
      },
    });

    const newPosition = (maxPositionFolder?.position ?? -1) + 1;

    const folder = await prisma.folders.create({
      data: {
        data_id,
        user_id: userId,
        title,
        color: color || null,
        parent_id: parentFolderId,
        position: newPosition,
      },
      include: {
        users: {
          select: {
            id: true,
            display_name: true,
          },
        },
        parent: {
          select: {
            id: true,
            title: true,
            color: true,
          },
        },
        _count: {
          select: {
            bookmarks: true,
            children: true,
          },
        },
      },
    });

    res.status(201).json({ ok: true, data: folder });
  } catch (error) {
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return res.status(409).json({
        ok: false,
        error:
          "Folder with this data_id already exists or duplicate title in the same parent",
      });
    }

    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update a folder
app.put(SERVICE_ENDPOINTS.FOLDERS.path + "/:data_id", async (req, res) => {
  try {
    const { data_id } = req.params;
    const userId = 1; // TODO: Get from auth session

    if (!data_id) {
      return res.status(400).json({ ok: false, error: "data_id is required" });
    }

    // Check if folder exists and belongs to user
    const existingFolder = await prisma.folders.findFirst({
      where: {
        data_id,
        user_id: userId,
        deleted_at: null,
      },
    });

    if (!existingFolder) {
      return res.status(404).json({
        ok: false,
        error: "Folder not found or access denied",
      });
    }

    const { title, color, parent_id, position } = req.body;

    // Build update data object with only provided fields
    const updateData: any = {
      updated_at: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (color !== undefined) updateData.color = color;
    if (position !== undefined) updateData.position = position;

    // Handle parent_id conversion from data_id to DB id if provided
    if (parent_id !== undefined) {
      if (parent_id === null) {
        updateData.parent_id = null;
      } else {
        const parentFolder = await prisma.folders.findFirst({
          where: {
            data_id: parent_id,
            user_id: userId,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        if (!parentFolder) {
          return res.status(404).json({
            ok: false,
            error: "Parent folder not found",
          });
        }

        updateData.parent_id = parentFolder.id;
      }
    }

    const folder = await prisma.folders.update({
      where: { id: existingFolder.id },
      data: updateData,
      include: {
        users: {
          select: {
            id: true,
            display_name: true,
          },
        },
        parent: {
          select: {
            id: true,
            title: true,
            color: true,
          },
        },
        _count: {
          select: {
            bookmarks: true,
            children: true,
          },
        },
      },
    });

    res.json({ ok: true, data: folder });
  } catch (error) {
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return res.status(409).json({
        ok: false,
        error: "Duplicate title in the same parent folder",
      });
    }

    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Delete a folder (soft delete)
app.delete(SERVICE_ENDPOINTS.FOLDERS.path + "/:data_id", async (req, res) => {
  try {
    const { data_id } = req.params;
    const userId = 1; // TODO: Get from auth session

    if (!data_id) {
      return res.status(400).json({ ok: false, error: "data_id is required" });
    }

    // Check if folder exists and belongs to user
    const existingFolder = await prisma.folders.findFirst({
      where: {
        data_id,
        user_id: userId,
      },
      include: {
        _count: {
          select: {
            children: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!existingFolder) {
      return res.status(404).json({
        ok: false,
        error: "Folder not found or access denied",
      });
    }

    // Optional: Prevent deletion if folder has children or bookmarks
    // Uncomment if you want to enforce this business rule
    // if (existingFolder._count.children > 0 || existingFolder._count.bookmarks > 0) {
    //   return res.status(400).json({
    //     ok: false,
    //     error: "Cannot delete folder with children or bookmarks",
    //   });
    // }

    // Soft delete by setting deleted_at timestamp
    const folder = await prisma.folders.update({
      where: { id: existingFolder.id },
      data: {
        deleted_at: new Date(),
      },
    });

    res.json({ ok: true, data: folder });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get(SERVICE_ENDPOINTS.TAGS.path, async (_req, res) => {
  try {
    const tags = await prisma.tags.findMany({
      where: {
        deleted_at: null,
      },
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
        name: "asc",
      },
    });
    res.json({ ok: true, data: tags });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create a new tag
app.post(SERVICE_ENDPOINTS.TAGS.path, async (req, res) => {
  try {
    const { name, color } = req.body;
    const userId = 1; // TODO: Get from auth session

    if (!name) {
      return res.status(400).json({
        ok: false,
        error: "name is required",
      });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/^-|-$/g, "");

    const tag = await prisma.tags.create({
      data: {
        user_id: userId,
        name,
        slug,
        color: color || null,
      },
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
    });

    res.status(201).json({ ok: true, data: tag });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return res.status(409).json({
        ok: false,
        error: "Tag with this name already exists",
      });
    }

    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update a tag
app.put(SERVICE_ENDPOINTS.TAGS.path + "/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = 1; // TODO: Get from auth session

    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "Invalid tag ID" });
    }

    const existingTag = await prisma.tags.findFirst({
      where: {
        id,
        user_id: userId,
        deleted_at: null,
      },
    });

    if (!existingTag) {
      return res.status(404).json({
        ok: false,
        error: "Tag not found or access denied",
      });
    }

    const { name, color } = req.body;

    const updateData: any = {
      updated_at: new Date(),
    };

    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9가-힣]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    if (color !== undefined) updateData.color = color;

    const tag = await prisma.tags.update({
      where: { id },
      data: updateData,
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
    });

    res.json({ ok: true, data: tag });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return res.status(409).json({
        ok: false,
        error: "Tag with this name already exists",
      });
    }

    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Delete a tag (soft delete)
app.delete(SERVICE_ENDPOINTS.TAGS.path + "/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = 1; // TODO: Get from auth session

    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "Invalid tag ID" });
    }

    const existingTag = await prisma.tags.findFirst({
      where: {
        id,
        user_id: userId,
        deleted_at: null,
      },
    });

    if (!existingTag) {
      return res.status(404).json({
        ok: false,
        error: "Tag not found or access denied",
      });
    }

    const tag = await prisma.tags.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });

    res.json({ ok: true, data: tag });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get(SERVICE_ENDPOINTS.STATS.path, async (_req, res) => {
  try {
    const [userCount, bookmarkCount, folderCount, tagCount] = await Promise.all(
      [
        prisma.users.count(),
        prisma.bookmarks.count(),
        prisma.folders.count(),
        prisma.tags.count(),
      ],
    );

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
      error: error instanceof Error ? error.message : "Unknown error",
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

    if (
      parentIdParam !== undefined &&
      parentIdParam !== "null" &&
      isNaN(parentId as number)
    ) {
      return res.status(400).json({ ok: false, error: "Invalid parent_id" });
    }

    const [folders, bookmarks] = await Promise.all([
      prisma.folders.findMany({
        where: { parent_id: parentId, deleted_at: null },
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
              children: true,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      }),
      prisma.bookmarks.findMany({
        where: { folder_id: parentId, deleted_at: null },
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
          position: "asc",
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
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get directory contents by path (e.g., /Development/Frontend)
app.get(SERVICE_ENDPOINTS.DIRECTORY.BY_PATH.path, async (req, res) => {
  try {
    const pathParam = req.query.path;
    const userId = 1; // TODO: Get from auth session (using first user from seed)

    if (!pathParam || typeof pathParam !== "string") {
      return res
        .status(400)
        .json({ ok: false, error: "Path parameter is required" });
    }

    if (!pathParam.startsWith("/")) {
      return res
        .status(400)
        .json({ ok: false, error: "Path must start with /" });
    }

    const segments = pathParam.split("/").filter(Boolean);

    // Handle root
    if (segments.length === 0) {
      const [folders, bookmarks] = await Promise.all([
        prisma.folders.findMany({
          where: { user_id: userId, parent_id: null, deleted_at: null },
          include: {
            users: { select: { id: true, display_name: true } },
            _count: { select: { bookmarks: true, children: true } },
          },
        }),
        prisma.bookmarks.findMany({
          where: { user_id: userId, folder_id: null, deleted_at: null },
          include: {
            users: {
              select: { id: true, display_name: true, avatar_url: true },
            },
            folders: { select: { id: true, title: true, color: true } },
            bookmark_tags: { include: { tags: true } },
            media: true,
          },
        }),
      ]);

      return res.json({
        ok: true,
        data: { folder: null, folders, bookmarks, path: "/", breadcrumbs: [] },
      });
    }

    // Sequential search
    let currentParentId = null;
    const breadcrumbs = [];

    for (const title of segments) {
      const folder = await prisma.folders.findFirst({
        where: { user_id: userId, parent_id: currentParentId, title, deleted_at: null },
      });

      if (!folder) {
        return res.status(404).json({
          ok: false,
          error: `Folder not found: ${title}`,
          breadcrumbs,
        });
      }

      breadcrumbs.push(folder);
      currentParentId = folder.id;
    }

    // Get contents of final folder
    const finalFolder = breadcrumbs[breadcrumbs.length - 1];
    const [folders, bookmarks] = await Promise.all([
      prisma.folders.findMany({
        where: { parent_id: finalFolder.id, deleted_at: null },
        include: {
          users: { select: { id: true, display_name: true } },
          _count: { select: { bookmarks: true, children: true } },
        },
      }),
      prisma.bookmarks.findMany({
        where: { folder_id: finalFolder.id, deleted_at: null },
        include: {
          users: { select: { id: true, display_name: true, avatar_url: true } },
          folders: { select: { id: true, title: true, color: true } },
          bookmark_tags: { include: { tags: true } },
          media: true,
        },
      }),
    ]);

    res.json({
      ok: true,
      data: {
        folder: finalFolder,
        folders,
        bookmarks,
        path: pathParam,
        breadcrumbs,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
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
