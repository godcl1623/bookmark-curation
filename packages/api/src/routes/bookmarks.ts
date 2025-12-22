import { Router } from "express";
import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import prisma from "../lib/prisma";
import { requireAuth } from "@/middleware/auth";

const router = Router();

// Get all bookmarks
router.get(
  SERVICE_ENDPOINTS.BOOKMARKS.ALL.path,
  requireAuth,
  async (req, res) => {
    try {
      const { search } = req.query;
      const userId = req.user!.id;

      // Build where clause with search conditions
      const whereClause: any = {
        user_id: userId,
        deleted_at: null,
      };

      // Add search conditions if search query is provided
      if (search && typeof search === "string" && search.trim() !== "") {
        const searchTerm = search.trim();
        whereClause.OR = [
          {
            title: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            domain: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            url: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            bookmark_tags: {
              some: {
                tags: {
                  name: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                  deleted_at: null,
                },
              },
            },
          },
        ];
      }

      const bookmarks = await prisma.bookmarks.findMany({
        where: whereClause,
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

      // Transform bookmark_tags to flat tags array
      const bookmarksWithTags = bookmarks.map((bookmark) => {
        const { bookmark_tags, ...rest } = bookmark;
        return {
          ...rest,
          tags: bookmark_tags.map((bt) => bt.tags),
        };
      });

      res.json({ ok: true, data: bookmarksWithTags });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Get bookmark by ID
router.get(
  SERVICE_ENDPOINTS.BOOKMARKS.DETAIL.path,
  requireAuth,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;

      if (isNaN(id)) {
        return res
          .status(400)
          .json({ ok: false, error: "Invalid bookmark ID" });
      }

      const bookmark = await prisma.bookmarks.findFirst({
        where: { id, user_id: userId, deleted_at: null },
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

      // Transform bookmark_tags to flat tags array
      const { bookmark_tags, ...rest } = bookmark;
      const bookmarkWithTags = {
        ...rest,
        tags: bookmark_tags.map((bt) => bt.tags),
      };

      res.json({ ok: true, data: bookmarkWithTags });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Validation helper functions
const FORBIDDEN_URL_SCHEMES =
  /^\s*(?:mailto:|file:|javascript:|postgresql:|jdbc:)/i;
const URL_STRICT_REGEX =
  /^https?:\/\/(?:[^\s:@\/]+@)?(?:localhost|[A-Za-z0-9.-]+\.[A-Za-z]{2,})(?::\d{1,5})?(?:[\\/?#][^\s]*)?$/i;
const URL_LAX_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:localhost|[A-Za-z0-9-]+\.)+[A-Za-z]{2,}(?::\d{1,5})?(?:[\\/?#][^\s]*)?$/i;

function validateUrl(url: string | undefined): {
  valid: boolean;
  url?: string;
  error?: string;
} {
  if (!url) {
    return { valid: false, error: "URL은 필수 항목입니다." };
  }

  const processedUrl = url.trim().toLowerCase();

  // Check forbidden schemes
  if (FORBIDDEN_URL_SCHEMES.test(processedUrl)) {
    return { valid: false, error: "금지된 URL 형식입니다." };
  }

  // Check URL format
  let isValidUrl = false;
  let isUrlWithScheme = false;

  if (URL_LAX_REGEX.test(processedUrl)) isValidUrl = true;
  if (URL_STRICT_REGEX.test(processedUrl)) isUrlWithScheme = true;

  if (!isValidUrl) {
    return { valid: false, error: "유효한 URL을 입력해주세요." };
  }

  // Check length
  if (processedUrl.length > 2000) {
    return {
      valid: false,
      error: "URL은 최대 2,000자 까지 입력할 수 있습니다.",
    };
  }

  // Validate with URL constructor
  try {
    const testUrl = isUrlWithScheme ? processedUrl : `https://${processedUrl}`;
    const result = new URL(testUrl);

    if (!/^https?:$/.test(result.protocol) || !result.hostname) {
      return { valid: false, error: "유효한 URL을 입력해주세요." };
    }

    if (result.port) {
      const port = Number(result.port);
      if (isNaN(port) || port < 0 || port > 65535) {
        return { valid: false, error: "유효한 URL을 입력해주세요." };
      }
    }

    return { valid: true, url: testUrl };
  } catch (error) {
    return { valid: false, error: "유효한 URL을 입력해주세요." };
  }
}

function validateTitle(title: string | undefined): {
  valid: boolean;
  title?: string;
  error?: string;
} {
  if (!title || title === "") {
    return { valid: true, title: "Untitled" };
  }

  if (title.length > 200) {
    return {
      valid: false,
      error: "제목은 최대 200자 까지 입력할 수 있습니다.",
    };
  }

  return { valid: true, title: title.trim() };
}

function validateDescription(description: string | undefined): {
  valid: boolean;
  description?: string;
  error?: string;
} {
  if (!description || description === "") {
    return { valid: true, description: "" };
  }

  if (description.length > 2000) {
    return {
      valid: false,
      error: "설명은 최대 2,000자 까지 입력할 수 있습니다.",
    };
  }

  return { valid: true, description: description.trim() };
}

// Create a new bookmark
router.post(
  SERVICE_ENDPOINTS.BOOKMARKS.ALL.path,
  requireAuth,
  async (req, res) => {
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
      const userId = req.user!.id;

      // Validate required fields
      if (!data_id) {
        return res.status(400).json({
          ok: false,
          error: "data_id is required",
        });
      }

      // Validate URL
      const urlValidation = validateUrl(url);
      if (!urlValidation.valid) {
        return res.status(400).json({
          ok: false,
          error: urlValidation.error,
        });
      }

      // Validate title
      const titleValidation = validateTitle(title);
      if (!titleValidation.valid) {
        return res.status(400).json({
          ok: false,
          error: titleValidation.error,
        });
      }

      // Validate description
      const descriptionValidation = validateDescription(description);
      if (!descriptionValidation.valid) {
        return res.status(400).json({
          ok: false,
          error: descriptionValidation.error,
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
          title: titleValidation.title,
          description: descriptionValidation.description,
          url: urlValidation.url!,
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

      // Transform bookmark_tags to flat tags array
      const bookmarkWithTags = createdBookmark
        ? (() => {
            const { bookmark_tags, ...rest } = createdBookmark;
            return {
              ...rest,
              tags: bookmark_tags.map((bt) => bt.tags),
            };
          })()
        : null;

      res.status(201).json({ ok: true, data: bookmarkWithTags });
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
  },
);

// Patch bookmark status (for quick state changes like favorite, archive, etc.)
router.patch(
  SERVICE_ENDPOINTS.BOOKMARKS.ALL.path + "/:data_id",
  requireAuth,
  async (req, res) => {
    try {
      const { data_id } = req.params;
      const userId = req.user!.id;

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

      const { is_favorite, is_archived, is_private } = req.body;

      // Build update data object with only provided status fields
      const updateData: any = {
        updated_at: new Date(),
      };

      // Only allow status field updates via PATCH
      if (is_favorite !== undefined) updateData.is_favorite = is_favorite;
      if (is_archived !== undefined) updateData.is_archived = is_archived;
      if (is_private !== undefined) updateData.is_private = is_private;

      // Check if at least one field is provided
      if (Object.keys(updateData).length === 1) {
        // Only updated_at is present
        return res.status(400).json({
          ok: false,
          error:
            "At least one status field (is_favorite, is_archived, is_private) must be provided",
        });
      }

      // Update bookmark status fields
      await prisma.bookmarks.update({
        where: { id: existingBookmark.id },
        data: updateData,
      });

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

      // Transform bookmark_tags to flat tags array
      const bookmarkWithTags = updatedBookmark
        ? (() => {
            const { bookmark_tags, ...rest } = updatedBookmark;
            return {
              ...rest,
              tags: bookmark_tags.map((bt) => bt.tags),
            };
          })()
        : null;

      res.json({ ok: true, data: bookmarkWithTags });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Update a bookmark
router.put(
  SERVICE_ENDPOINTS.BOOKMARKS.ALL.path + "/:data_id",
  requireAuth,
  async (req, res) => {
    try {
      const { data_id } = req.params;
      const userId = req.user!.id;

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

      // Validate URL if provided
      if (url !== undefined) {
        const urlValidation = validateUrl(url);
        if (!urlValidation.valid) {
          return res.status(400).json({
            ok: false,
            error: urlValidation.error,
          });
        }
      }

      // Validate title if provided
      if (title !== undefined) {
        const titleValidation = validateTitle(title);
        if (!titleValidation.valid) {
          return res.status(400).json({
            ok: false,
            error: titleValidation.error,
          });
        }
      }

      // Validate description if provided
      if (description !== undefined) {
        const descriptionValidation = validateDescription(description);
        if (!descriptionValidation.valid) {
          return res.status(400).json({
            ok: false,
            error: descriptionValidation.error,
          });
        }
      }

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

      // Apply validated values
      if (title !== undefined) {
        const titleValidation = validateTitle(title);
        updateData.title = titleValidation.title;
      }
      if (description !== undefined) {
        const descriptionValidation = validateDescription(description);
        updateData.description = descriptionValidation.description;
      }
      if (url !== undefined) {
        const urlValidation = validateUrl(url);
        updateData.url = urlValidation.url;
      }
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

      // Transform bookmark_tags to flat tags array
      const bookmarkWithTags = updatedBookmark
        ? (() => {
            const { bookmark_tags, ...rest } = updatedBookmark;
            return {
              ...rest,
              tags: bookmark_tags.map((bt) => bt.tags),
            };
          })()
        : null;

      res.json({ ok: true, data: bookmarkWithTags });
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
  },
);

// Delete a bookmark (soft delete)
router.delete(
  SERVICE_ENDPOINTS.BOOKMARKS.ALL.path + "/:data_id",
  requireAuth,
  async (req, res) => {
    try {
      const { data_id } = req.params;
      const userId = req.user!.id;

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
  },
);

export default router;
