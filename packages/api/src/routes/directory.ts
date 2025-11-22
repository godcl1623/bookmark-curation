import { Router } from "express";
import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import prisma from "../lib/prisma";

const router = Router();

// Get directory contents (folders and bookmarks) by parent_id
router.get(SERVICE_ENDPOINTS.DIRECTORY.CONTENTS.path, async (req, res) => {
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
router.get(SERVICE_ENDPOINTS.DIRECTORY.BY_PATH.path, async (req, res) => {
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

export default router;
