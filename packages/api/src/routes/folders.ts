import { Router } from "express";
import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import { requireAuth } from "../middleware/auth";
import * as folderService from "../services/folders";

const router = Router();

router.get(SERVICE_ENDPOINTS.FOLDERS.path, requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const folders = await folderService.getAllFolders(userId);
    return res.json({ ok: true, data: folders });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post(SERVICE_ENDPOINTS.FOLDERS.path, requireAuth, async (req, res) => {
  try {
    const { data_id, title, color, parent_id } = req.body;
    const userId = req.user!.id;

    if (!data_id || !title) {
      return res.status(400).json({
        ok: false,
        error: "data_id and title are required",
      });
    }

    const folder = await folderService.createFolder(userId, {
      data_id,
      title,
      color,
      parent_id,
    });

    return res.status(201).json({ ok: true, data: folder });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        ok: false,
        error: "Parent folder not found",
      });
    }

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return res.status(409).json({
        ok: false,
        error:
          "Folder with this data_id already exists or duplicate title in the same parent",
      });
    }

    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.put(SERVICE_ENDPOINTS.FOLDERS.path + "/:data_id", requireAuth, async (req, res) => {
  try {
    const { data_id } = req.params;
    const userId = req.user!.id;

    if (!data_id) {
      return res.status(400).json({ ok: false, error: "data_id is required" });
    }

    const { title, color, parent_id, position } = req.body;

    const folder = await folderService.updateFolder(userId, data_id, {
      title,
      color,
      parent_id,
      position,
    });

    return res.json({ ok: true, data: folder });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        ok: false,
        error: "Folder not found or access denied",
      });
    }

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return res.status(409).json({
        ok: false,
        error: "Duplicate title in the same parent folder",
      });
    }

    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.delete(
  SERVICE_ENDPOINTS.FOLDERS.path + "/:data_id",
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

      const folder = await folderService.deleteFolder(userId, data_id);

      return res.json({ ok: true, data: folder });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({
          ok: false,
          error: "Folder not found or access denied",
        });
      }

      return res.status(500).json({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

export default router;
