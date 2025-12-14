import { Router } from "express";
import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Get all users
router.get(SERVICE_ENDPOINTS.USERS.path, requireAuth, async (_req, res) => {
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

// Get statistics
router.get(SERVICE_ENDPOINTS.STATS.path, requireAuth, async (_req, res) => {
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

export default router;
