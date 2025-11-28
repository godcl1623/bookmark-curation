import { Router } from "express";
import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import prisma from "../lib/prisma";

const router = Router();

// Get all bookmarks
router.get(SERVICE_ENDPOINTS.BOOKMARKS.ALL.path, async (_req, res) => {
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

// Get bookmark by ID
router.get(SERVICE_ENDPOINTS.BOOKMARKS.DETAIL.path, async (req, res) => {
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

// Create a new bookmark
router.post(SERVICE_ENDPOINTS.BOOKMARKS.ALL.path, async (req, res) => {
  try {
    const {
      data_id,
      parent_id,
      title,
      description,
      url,
      domain,
      favicon_url,
      preview_image,
      metadata,
      is_favorite,
      is_archived,
      is_private,
      type,
      tag_ids,
    } = req.body;
    const userId = 1; // TODO: Get from auth session

    // Validate required fields
    if (!data_id || !url) {
      return res.status(400).json({
        ok: false,
        error: "data_id and url are required",
      });
    }

    // Validate tag_ids if provided
    if (tag_ids !== undefined && !Array.isArray(tag_ids)) {
      return res.status(400).json({
        ok: false,
        error: "tag_ids must be an array",
      });
    }

    // Verify tags belong to user if tag_ids are provided
    if (tag_ids && tag_ids.length > 0) {
      const uniqueTagIds = [...new Set(tag_ids)];
      const existingTags = await prisma.tags.findMany({
        where: {
          id: { in: uniqueTagIds },
          user_id: userId,
          deleted_at: null,
        },
        select: {
          id: true,
        },
      });

      if (existingTags.length !== uniqueTagIds.length) {
        return res.status(404).json({
          ok: false,
          error: "One or more tags not found or access denied",
        });
      }
    }

    // Find folder by data_id if parent_id is provided
    let dbFolderId: number | null = null;
    if (parent_id) {
      const folder = await prisma.folders.findFirst({
        where: {
          data_id: parent_id,
          user_id: userId,
          deleted_at: null,
        },
        select: {
          id: true,
        },
      });

      if (!folder) {
        return res.status(404).json({
          ok: false,
          error: "Folder not found",
        });
      }

      dbFolderId = folder.id;
    }

    // Get the highest position to append the new bookmark at the end
    const maxPositionBookmark = await prisma.bookmarks.findFirst({
      where: {
        user_id: userId,
        folder_id: dbFolderId,
      },
      orderBy: {
        position: "desc",
      },
      select: {
        position: true,
      },
    });

    const newPosition = (maxPositionBookmark?.position ?? -1) + 1;

    const bookmark = await prisma.bookmarks.create({
      data: {
        data_id,
        user_id: userId,
        folder_id: dbFolderId,
        parent_id: parent_id !== undefined ? parent_id : null,
        title: title !== undefined ? title : null,
        description: description !== undefined ? description : null,
        url,
        domain: domain !== undefined ? domain : null,
        favicon_url: favicon_url !== undefined ? favicon_url : null,
        preview_image: preview_image !== undefined ? preview_image : null,
        metadata: metadata || {},
        is_favorite: is_favorite ?? false,
        is_archived: is_archived ?? false,
        is_private: is_private ?? true,
        position: newPosition,
        type: type || "bookmark",
      },
    });

    // Create bookmark_tags relationships if tag_ids are provided
    if (tag_ids && tag_ids.length > 0) {
      const uniqueTagIds = [...new Set(tag_ids)];
      await prisma.bookmark_tags.createMany({
        data: uniqueTagIds.map((tag_id) => ({
          bookmark_id: bookmark.id,
          tag_id,
          user_id: userId,
        })),
      });
    }

    // Fetch the created bookmark with all relations
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
        media: true,
      },
    });

    res.status(201).json({ ok: true, data: createdBookmark });
  } catch (error) {
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return res.status(409).json({
        ok: false,
        error: "Bookmark with this data_id already exists",
      });
    }

    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update a bookmark
router.put(
  SERVICE_ENDPOINTS.BOOKMARKS.ALL.path + "/:data_id",
  async (req, res) => {
    try {
      const { data_id } = req.params;
      const userId = 1; // TODO: Get from auth session

      if (!data_id) {
        return res
          .status(400)
          .json({ ok: false, error: "data_id is required" });
      }

      // Check if bookmark exists and belongs to user
      const existingBookmark = await prisma.bookmarks.findFirst({
        where: {
          data_id,
          user_id: userId,
          deleted_at: null,
        },
      });

      if (!existingBookmark) {
        return res.status(404).json({
          ok: false,
          error: "Bookmark not found or access denied",
        });
      }

      const {
        folder_id,
        parent_id,
        title,
        description,
        url,
        domain,
        favicon_url,
        preview_image,
        metadata,
        is_favorite,
        is_archived,
        is_private,
        position,
        type,
        tag_ids,
      } = req.body;

      // Validate tag_ids if provided
      if (tag_ids !== undefined && !Array.isArray(tag_ids)) {
        return res.status(400).json({
          ok: false,
          error: "tag_ids must be an array",
        });
      }

      // Verify tags belong to user if tag_ids are provided
      if (tag_ids !== undefined && tag_ids.length > 0) {
        const uniqueTagIds = [...new Set(tag_ids)];
        const existingTags = await prisma.tags.findMany({
          where: {
            id: { in: uniqueTagIds },
            user_id: userId,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        if (existingTags.length !== uniqueTagIds.length) {
          return res.status(404).json({
            ok: false,
            error: "One or more tags not found or access denied",
          });
        }
      }

      // Build update data object with only provided fields
      const updateData: any = {
        updated_at: new Date(),
      };

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (url !== undefined) updateData.url = url;
      if (domain !== undefined) updateData.domain = domain;
      if (favicon_url !== undefined) updateData.favicon_url = favicon_url;
      if (preview_image !== undefined) updateData.preview_image = preview_image;
      if (metadata !== undefined) updateData.metadata = metadata;
      if (is_favorite !== undefined) updateData.is_favorite = is_favorite;
      if (is_archived !== undefined) updateData.is_archived = is_archived;
      if (is_private !== undefined) updateData.is_private = is_private;
      if (position !== undefined) updateData.position = position;
      if (parent_id !== undefined) updateData.parent_id = parent_id;
      if (type !== undefined) updateData.type = type;

      // Handle folder_id conversion from data_id to DB id if provided
      if (folder_id !== undefined) {
        if (folder_id === null) {
          updateData.folder_id = null;
        } else {
          const folder = await prisma.folders.findFirst({
            where: {
              data_id: folder_id,
              user_id: userId,
              deleted_at: null,
            },
            select: {
              id: true,
            },
          });

          if (!folder) {
            return res.status(404).json({
              ok: false,
              error: "Folder not found",
            });
          }

          updateData.folder_id = folder.id;
        }
      }

      // Update bookmark fields
      await prisma.bookmarks.update({
        where: { id: existingBookmark.id },
        data: updateData,
      });

      // Handle tag_ids replacement if provided
      if (tag_ids !== undefined) {
        // Delete existing bookmark_tags
        await prisma.bookmark_tags.deleteMany({
          where: {
            bookmark_id: existingBookmark.id,
          },
        });

        // Create new bookmark_tags if tag_ids is not empty
        if (tag_ids.length > 0) {
          const uniqueTagIds = [...new Set(tag_ids)];
          await prisma.bookmark_tags.createMany({
            data: uniqueTagIds.map((tag_id) => ({
              bookmark_id: existingBookmark.id,
              tag_id,
              user_id: userId,
            })),
          });
        }
      }

      // Fetch the updated bookmark with all relations
      const updatedBookmark = await prisma.bookmarks.findUnique({
        where: { id: existingBookmark.id },
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
      });

      res.json({ ok: true, data: updatedBookmark });
    } catch (error) {
      // Handle unique constraint violation
      if (
        error instanceof Error &&
        error.message.includes("Unique constraint")
      ) {
        return res.status(409).json({
          ok: false,
          error: "Bookmark with this data_id already exists",
        });
      }

      res.status(500).json({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Delete a bookmark (soft delete)
router.delete(
  SERVICE_ENDPOINTS.BOOKMARKS.ALL.path + "/:data_id",
  async (req, res) => {
    try {
      const { data_id } = req.params;
      const userId = 1; // TODO: Get from auth session

      if (!data_id) {
        return res
          .status(400)
          .json({ ok: false, error: "data_id is required" });
      }

      // Check if bookmark exists and belongs to user
      const existingBookmark = await prisma.bookmarks.findFirst({
        where: {
          data_id,
          user_id: userId,
          deleted_at: null,
        },
      });

      if (!existingBookmark) {
        return res.status(404).json({
          ok: false,
          error: "Bookmark not found or access denied",
        });
      }

      // Soft delete by setting deleted_at timestamp
      const bookmark = await prisma.bookmarks.update({
        where: { id: existingBookmark.id },
        data: {
          deleted_at: new Date(),
        },
      });

      res.json({ ok: true, data: bookmark });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export default router;
