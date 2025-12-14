import { Router, Request, Response } from "express";
import passport from "passport";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashRefreshToken,
  createSession,
  findValidSession,
  revokeSession,
  revokeAllUserSessions,
  getRefreshTokenExpiryDate,
} from "../lib/auth";
import { requireAuth } from "../middleware/auth";

const router = Router();

const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  };
};

router.get(
  "/api/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

router.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user;

      if (!user || !user.email) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
      }

      const accessToken = generateAccessToken({
        userId: user.id,
        uuid: user.uuid,
        email: user.email,
      });

      const refreshToken = generateRefreshToken({
        userId: user.id,
        uuid: user.uuid,
        email: user.email,
      });

      const refreshTokenHash = await hashRefreshToken(refreshToken);
      const expiresAt = getRefreshTokenExpiryDate();

      await createSession({
        userId: user.id,
        refreshTokenHash,
        expiresAt,
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip,
      });

      res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, getCookieOptions());

      return res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  }
);

router.post("/api/auth/refresh", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (!refreshToken) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Refresh token not found",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const session = await findValidSession(decoded.userId, refreshToken);

    if (!session) {
      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, getCookieOptions());
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid or expired session",
      });
    }

    const accessToken = generateAccessToken({
      userId: decoded.userId,
      uuid: decoded.uuid,
      email: decoded.email,
    });

    return res.json({
      access_token: accessToken,
      token_type: "Bearer",
    });
  } catch (error) {
    console.error("Token refresh error:", error);

    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, getCookieOptions());

    return res.status(401).json({
      error: "Unauthorized",
      message: error instanceof Error ? error.message : "Token refresh failed",
    });
  }
});

router.post("/api/auth/logout", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
      });
    }

    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (refreshToken) {
      try {
        const session = await findValidSession(user.id, refreshToken);
        if (session) {
          await revokeSession(session.id);
        }
      } catch (error) {
        console.error("Session revocation error:", error);
      }
    }

    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, getCookieOptions());

    return res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Logout failed",
    });
  }
});

router.post("/api/auth/logout-all", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
      });
    }

    await revokeAllUserSessions(user.id);

    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, getCookieOptions());

    return res.json({
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    console.error("Logout all error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Logout from all devices failed",
    });
  }
});

router.get("/api/auth/me", requireAuth, (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "User not authenticated",
    });
  }

  return res.json({
    user: {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      locale: user.locale,
    },
  });
});

export default router;
