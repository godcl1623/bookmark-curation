import bcrypt from "bcryptjs";
import prisma from "../prisma";

const SALT_ROUNDS = 10;

export const hashRefreshToken = async (token: string): Promise<string> => {
  return bcrypt.hash(token, SALT_ROUNDS);
};

export const compareRefreshToken = async (
  token: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(token, hash);
};

export interface CreateSessionParams {
  userId: number;
  refreshTokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export const createSession = async (params: CreateSessionParams) => {
  const { userId, refreshTokenHash, expiresAt, userAgent, ipAddress } = params;

  return prisma.sessions.create({
    data: {
      user_id: userId,
      refresh_token_hash: refreshTokenHash,
      expires_at: expiresAt,
      user_agent: userAgent,
      ip: ipAddress,
      revoked: false,
    },
  });
};

export const findValidSession = async (userId: number, refreshToken: string) => {
  const sessions = await prisma.sessions.findMany({
    where: {
      user_id: userId,
      revoked: false,
      expires_at: {
        gt: new Date(),
      },
    },
  });

  for (const session of sessions) {
    const isValid = await compareRefreshToken(refreshToken, session.refresh_token_hash);
    if (isValid) {
      return session;
    }
  }

  return null;
};

export const revokeSession = async (sessionId: number) => {
  return prisma.sessions.update({
    where: { id: sessionId },
    data: {
      revoked: true,
    },
  });
};

export const revokeAllUserSessions = async (userId: number) => {
  return prisma.sessions.updateMany({
    where: {
      user_id: userId,
      revoked: false,
    },
    data: {
      revoked: true,
    },
  });
};

export const cleanupExpiredSessions = async () => {
  return prisma.sessions.deleteMany({
    where: {
      OR: [
        {
          expires_at: {
            lt: new Date(),
          },
        },
        {
          revoked: true,
          created_at: {
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          },
        },
      ],
    },
  });
};

export const getRefreshTokenExpiryDate = (): Date => {
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const milliseconds = {
    s: value * 1000,
    m: value * 60 * 1000,
    h: value * 60 * 60 * 1000,
    d: value * 24 * 60 * 60 * 1000,
  }[unit] || 7 * 24 * 60 * 60 * 1000;

  return new Date(Date.now() + milliseconds);
};
