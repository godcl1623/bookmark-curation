import { Router } from "express";
import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import prisma from "../lib/prisma";

const router = Router();

// Get all folders
router.get(SERVICE_ENDPOINTS.FOLDERS.path, async (_req, res) => {
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
router.post(SERVICE_ENDPOINTS.FOLDERS.path, async (req, res) => {
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
router.put(SERVICE_ENDPOINTS.FOLDERS.path + "/:data_id", async (req, res) => {
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
router.delete(SERVICE_ENDPOINTS.FOLDERS.path + "/:data_id", async (req, res) => {
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

export default router;
