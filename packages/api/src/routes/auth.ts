import { Request, Response, Router } from "express";
import passport from "passport";
import {
  createSession,
  findValidSession,
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiryDate,
  hashRefreshToken,
  revokeAllUserSessions,
  revokeSession,
  verifyRefreshToken,
} from "../lib/auth";
import { requireAuth } from "../middleware/auth";
import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import { decrypt } from "../lib/encryption";

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
  SERVICE_ENDPOINTS.AUTH.GOOGLE.SIGNIN.path,
  (req: Request, res: Response, next: any) => {
    passport.authenticate("google", {
      session: false,
      scope: ["profile", "email"],
      state: "web",
    })(req, res, next);
  },
);

router.get(
  "/auth/google/mobile",
  (req: Request, res: Response, next: any) => {
    passport.authenticate("google", {
      session: false,
      scope: ["profile", "email"],
      state: "mobile",
    })(req, res, next);
  },
);

router.get(
  SERVICE_ENDPOINTS.AUTH.GOOGLE.CALLBACK.path,
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user;
      const state = req.query.state as string;
      const isMobile = state === "mobile";

      if (!user || !user.email) {
        const errorUrl = isMobile
          ? `${process.env.FRONTEND_URL}/login?error=authentication_failed&mobile=true`
          : `${process.env.FRONTEND_URL}/login?error=authentication_failed`;
        return res.redirect(errorUrl);
      }

      const accessToken = generateAccessToken({
        userId: user.id,
        uuid: user.uuid,
      });

      const refreshToken = generateRefreshToken({
        userId: user.id,
        uuid: user.uuid,
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

      const redirectUrl = isMobile
        ? `${process.env.FRONTEND_URL}/auth/callback?mobile=true&token=${accessToken}`
        : `${process.env.FRONTEND_URL}/auth/callback#access_token=${accessToken}`;

      return res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      const state = req.query.state as string;
      const isMobile = state === "mobile";
      const errorUrl = isMobile
        ? `${process.env.FRONTEND_URL}/login?error=server_error&mobile=true`
        : `${process.env.FRONTEND_URL}/login?error=server_error`;
      return res.redirect(errorUrl);
    }
  },
);

router.post(
  SERVICE_ENDPOINTS.AUTH.REFRESH.path,
  async (req: Request, res: Response) => {
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
        message:
          error instanceof Error ? error.message : "Token refresh failed",
      });
    }
  },
);

router.post(
  SERVICE_ENDPOINTS.AUTH.LOGOUT.CURRENT.path,
  requireAuth,
  async (req: Request, res: Response) => {
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
  },
);

router.post(
  SERVICE_ENDPOINTS.AUTH.LOGOUT.ALL.path,
  requireAuth,
  async (req: Request, res: Response) => {
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
  },
);

router.get(
  SERVICE_ENDPOINTS.AUTH.ME.path,
  requireAuth,
  (req: Request, res: Response) => {
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
        email: user.email ? decrypt(user.email) : null,
        display_name: user.display_name ? decrypt(user.display_name) : null,
        avatar_url: user.avatar_url,
        locale: user.locale,
      },
    });
  },
);

export default router;
