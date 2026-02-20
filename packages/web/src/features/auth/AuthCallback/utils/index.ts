export const isValidToken = (token: string): boolean => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));

    if (!payload.exp || !payload.userId || !payload.uuid || !payload.type) {
      return false;
    }

    if (payload.type !== "access") return false;

    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};
