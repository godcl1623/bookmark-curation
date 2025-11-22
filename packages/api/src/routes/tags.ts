import { Router } from "express";
import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import prisma from "../lib/prisma";

const router = Router();

// Get all tags
router.get(SERVICE_ENDPOINTS.TAGS.path, async (_req, res) => {
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
router.post(SERVICE_ENDPOINTS.TAGS.path, async (req, res) => {
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
router.put(SERVICE_ENDPOINTS.TAGS.path + "/:id", async (req, res) => {
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
router.delete(SERVICE_ENDPOINTS.TAGS.path + "/:id", async (req, res) => {
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

export default router;
