import { Router } from "express";
import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import { requireAuth } from "../middleware/auth";
import * as tagService from "../services/tags";

const router = Router();

router.get(SERVICE_ENDPOINTS.TAGS.path, requireAuth, async (req, res) => {
  try {
    const { search, sort_by, limit } = req.query;
    const userId = req.user!.id;
    const limitNum = limit ? parseInt(limit as string) : undefined;

    if (limitNum !== undefined && (isNaN(limitNum) || limitNum < 1)) {
      return res.status(400).json({
        ok: false,
        error: "Invalid limit parameter",
      });
    }

    const tags = await tagService.getAllTags(userId, {
      search: search as string,
      sort_by: sort_by as "name" | "count",
      limit: limitNum,
    });

    return res.json({ ok: true, data: tags });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post(SERVICE_ENDPOINTS.TAGS.path, requireAuth, async (req, res) => {
  try {
    const { name, color } = req.body;
    const userId = req.user!.id;

    if (!name) {
      return res.status(400).json({
        ok: false,
        error: "name is required",
      });
    }

    const tag = await tagService.createTag(userId, { name, color });

    return res.status(201).json({ ok: true, data: tag });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return res.status(409).json({
        ok: false,
        error: "Tag with this name already exists",
      });
    }

    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get(SERVICE_ENDPOINTS.TAGS.path + "/:id", requireAuth, async (_req, res) => {
  return res.status(501).json({
    ok: false,
    error: "Not implemented",
  });
});

router.put(SERVICE_ENDPOINTS.TAGS.path + "/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.id;

    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "Invalid tag ID" });
    }

    const { name, color } = req.body;
    const tag = await tagService.updateTag(userId, id, { name, color });

    return res.json({ ok: true, data: tag });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        ok: false,
        error: "Tag not found or access denied",
      });
    }

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return res.status(409).json({
        ok: false,
        error: "Tag with this name already exists",
      });
    }

    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.delete(SERVICE_ENDPOINTS.TAGS.path + "/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.id;

    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "Invalid tag ID" });
    }

    const tag = await tagService.deleteTag(userId, id);

    return res.json({ ok: true, data: tag });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        ok: false,
        error: "Tag not found or access denied",
      });
    }

    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
