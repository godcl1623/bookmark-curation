import jwt, { SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  userId: number;
  uuid: string;
  email: string;
  type: "access" | "refresh";
}

export interface DecodedJwtPayload extends JwtPayload {
  iat: number;
  exp: number;
}

const getAccessSecret = (): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
  }
  return secret;
};

const getRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
  }
  return secret;
};

export const generateAccessToken = (payload: Omit<JwtPayload, "type">): string => {
  const secret = getAccessSecret();
  const expiresIn = (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as any;

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(
    { ...payload, type: "access" },
    secret,
    options
  );
};

export const generateRefreshToken = (payload: Omit<JwtPayload, "type">): string => {
  const secret = getRefreshSecret();
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as any;

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(
    { ...payload, type: "refresh" },
    secret,
    options
  );
};

export const verifyAccessToken = (token: string): DecodedJwtPayload => {
  try {
    const decoded = jwt.verify(token, getAccessSecret()) as DecodedJwtPayload;

    if (decoded.type !== "access") {
      throw new Error("Invalid token type");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid access token");
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Access token expired");
    }
    throw error;
  }
};

export const verifyRefreshToken = (token: string): DecodedJwtPayload => {
  try {
    const decoded = jwt.verify(token, getRefreshSecret()) as DecodedJwtPayload;

    if (decoded.type !== "refresh") {
      throw new Error("Invalid token type");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid refresh token");
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Refresh token expired");
    }
    throw error;
  }
};

export const decodeToken = (token: string): DecodedJwtPayload | null => {
  try {
    return jwt.decode(token) as DecodedJwtPayload;
  } catch {
    return null;
  }
};
