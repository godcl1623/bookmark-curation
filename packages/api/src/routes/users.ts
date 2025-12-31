import { Router } from "express";
import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { decrypt } from "../lib/encryption";

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

    // Decrypt user data
    const decryptedUsers = users.map((user) => ({
      ...user,
      email: user.email ? decrypt(user.email) : null,
      display_name: user.display_name ? decrypt(user.display_name) : null,
    }));

    res.json({ ok: true, data: decryptedUsers });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get statistics for current user
router.get(SERVICE_ENDPOINTS.STATS.path, requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;

    const [bookmarkCount, folderCount, tagCount] = await Promise.all([
      prisma.bookmarks.count({
        where: {
          user_id: userId,
          deleted_at: null,
        },
      }),
      prisma.folders.count({
        where: {
          user_id: userId,
          deleted_at: null,
        },
      }),
      prisma.tags.count({
        where: {
          user_id: userId,
          deleted_at: null,
        },
      }),
    ]);

    res.json({
      ok: true,
      data: {
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
