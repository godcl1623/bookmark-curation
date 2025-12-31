import { Router } from "express";
import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { decrypt } from "../lib/encryption";
import * as bookmarkService from "../services/bookmarks";

const router = Router();

// Helper function to decrypt folder data
function decryptFolder(folder: any): any {
  if (!folder) return null;

  const decrypted: any = {
    ...folder,
    title: decrypt(folder.title)!,
  };

  if (decrypted.users) {
    decrypted.users = {
      ...decrypted.users,
      display_name: decrypted.users.display_name
        ? decrypt(decrypted.users.display_name)
        : null,
    };
  }

  if (decrypted.parent) {
    decrypted.parent = {
      ...decrypted.parent,
      title: decrypt(decrypted.parent.title)!,
    };
  }

  return decrypted;
}

// Get directory contents (folders and bookmarks) by parent_id
router.get(SERVICE_ENDPOINTS.DIRECTORY.CONTENTS.path, requireAuth, async (req, res) => {
  try {
    const parentIdParam = req.query.parent_id;
    const userId = req.user!.id;
    const parentId: number | null =
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

    // Get folders (will decrypt manually)
    const foldersRaw = await prisma.folders.findMany({
      where: { user_id: userId, parent_id: parentId, deleted_at: null },
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
    });

    // Decrypt folders
    const folders = foldersRaw.map(decryptFolder);

    // Get bookmarks using service (will decrypt automatically)
    const allBookmarks = await bookmarkService.getAllBookmarks(userId);
    const bookmarks = allBookmarks.filter(
      (b) => b.folder_id === parentId
    ).sort((a, b) => a.position - b.position);

    return res.json({
      ok: true,
      data: {
        parent_id: parentId,
        folders,
        bookmarks,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get directory contents by path (e.g., /Development/Frontend)
router.get(SERVICE_ENDPOINTS.DIRECTORY.BY_PATH.path, requireAuth, async (req, res) => {
  try {
    const pathParam = req.query.path;
    const userId = req.user!.id;

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
      const foldersRaw = await prisma.folders.findMany({
        where: { user_id: userId, parent_id: null, deleted_at: null },
        include: {
          users: { select: { id: true, display_name: true } },
          _count: { select: { bookmarks: true, children: true } },
        },
      });

      const folders = foldersRaw.map(decryptFolder);

      const allBookmarks = await bookmarkService.getAllBookmarks(userId);
      const bookmarks = allBookmarks.filter((b) => b.folder_id === null);

      return res.json({
        ok: true,
        data: {
          folder: null,
          folders,
          bookmarks,
          path: "/",
          breadcrumbs: [],
        },
      });
    }

    // Sequential search
    let currentParentId: number | null = null;
    const breadcrumbs: any[] = [];

    for (const folderTitle of segments) {
      // Get all folders at this level and decrypt them
      const foldersAtLevel: any = await prisma.folders.findMany({
        where: {
          user_id: userId,
          parent_id: currentParentId,
          deleted_at: null,
        },
      });

      const decryptedFolders: any = foldersAtLevel.map(decryptFolder);

      // Find the folder with matching title (after decryption)
      const folder: any = decryptedFolders.find(
        (f: any) => f.title === folderTitle
      );

      if (!folder) {
        return res.status(404).json({
          ok: false,
          error: `Folder not found: ${folderTitle}`,
          breadcrumbs,
        });
      }

      breadcrumbs.push(folder);
      currentParentId = folder.id;
    }

    // Get contents of final folder
    const finalFolder = breadcrumbs[breadcrumbs.length - 1];

    const foldersRaw = await prisma.folders.findMany({
      where: { parent_id: finalFolder.id, deleted_at: null },
      include: {
        users: { select: { id: true, display_name: true } },
        _count: { select: { bookmarks: true, children: true } },
      },
    });

    const folders = foldersRaw.map(decryptFolder);

    const allBookmarks = await bookmarkService.getAllBookmarks(userId);
    const bookmarks = allBookmarks.filter((b) => b.folder_id === finalFolder.id);

    return res.json({
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
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
