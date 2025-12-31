import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32;

function getMasterKey(): string {
  const key = process.env.ENCRYPTION_MASTER_KEY;
  if (!key) {
    throw new Error(
      "ENCRYPTION_MASTER_KEY environment variable is not set. " +
        "Generate one with: openssl rand -base64 32"
    );
  }
  return key;
}

function deriveKey(salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(getMasterKey(), salt, 100000, KEY_LENGTH, "sha256");
}

export function encrypt(plaintext: string | null): string | null {
  if (plaintext === null || plaintext === undefined) {
    return null;
  }

  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = deriveKey(salt);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString("base64");
}

export function decrypt(ciphertext: string | null): string | null {
  if (ciphertext === null || ciphertext === undefined) {
    return null;
  }

  try {
    const buffer = Buffer.from(ciphertext, "base64");

    const salt = buffer.subarray(0, SALT_LENGTH);
    const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = buffer.subarray(
      SALT_LENGTH + IV_LENGTH,
      SALT_LENGTH + IV_LENGTH + TAG_LENGTH
    );
    const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

    const key = deriveKey(salt);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    return decipher.update(encrypted) + decipher.final("utf8");
  } catch (error) {
    throw new Error(
      `Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export function createSearchHash(text: string | null): string | null {
  if (text === null || text === undefined || text.trim() === "") {
    return null;
  }

  const normalized = text.toLowerCase().trim();
  return crypto
    .createHmac("sha256", getMasterKey())
    .update(normalized)
    .digest("hex");
}

export function encryptJSON(data: any): string | null {
  if (data === null || data === undefined) {
    return null;
  }
  return encrypt(JSON.stringify(data));
}

export function decryptJSON<T = any>(ciphertext: string | null): T | null {
  if (ciphertext === null || ciphertext === undefined) {
    return null;
  }
  const decrypted = decrypt(ciphertext);
  if (decrypted === null) {
    return null;
  }
  return JSON.parse(decrypted) as T;
}
