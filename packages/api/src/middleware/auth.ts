import { Request, Response, NextFunction } from "express";
import passport from "passport";

export interface AuthenticatedUser {
  id: number;
  uuid: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  locale: string | null;
  is_active: boolean | null;
}

declare global {
  namespace Express {
    interface User extends AuthenticatedUser {}
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate("jwt", { session: false }, (err: Error, user: AuthenticatedUser | false, info: { message?: string }) => {
    if (err) {
      res.status(500).json({
        error: "Authentication error",
        message: err.message,
      });
      return;
    }

    if (!user) {
      res.status(401).json({
        error: "Unauthorized",
        message: info?.message || "Authentication required",
      });
      return;
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  passport.authenticate("jwt", { session: false }, (err: Error, user: AuthenticatedUser | false) => {
    if (err || !user) {
      return next();
    }

    req.user = user;
    next();
  })(req, res, next);
};
