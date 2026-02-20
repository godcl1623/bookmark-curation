import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { isValidToken } from "@/features/auth/AuthCallback/utils";

describe("# isValidToken 테스트", () => {
  const createTestToken = (payload: object): string => {
    const header = btoa(JSON.stringify({ typ: "JWT", alg: "HS256" }));
    const body = btoa(JSON.stringify(payload));
    const signature = "test-signature";
    return `${header}.${body}.${signature}`;
  };

  beforeEach(() => {
    // 날짜를 2026-01-15로 고정
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const validPayload = {
    exp: Math.floor(new Date("2026-12-31").getTime() / 1000),
    userId: "1",
    uuid: "aaaaaa-bbbbbb-cccccc-dddddd-eeeeee",
    type: "access",
  };

  test("## 1. 유효한 토큰 → true", () => {
    const token = createTestToken(validPayload);
    const result = isValidToken(token);
    expect(result).toBe(true);
  });

  test("## 2. 토큰의 파트가 3개가 아님 → false", () => {
    const token = createTestToken(validPayload);
    const partialToken = token.split(".").slice(1).join(".");
    const result = isValidToken(partialToken);
    expect(result).toBe(false);
  });

  test("## 3. base64 디코딩 실패 → false", () => {
    const result = isValidToken("invalid token");
    expect(result).toBe(false);
  });

  test("## 4. 필수 필드 누락 → false", () => {
    const invalidPayload = { ...validPayload, uuid: undefined };
    const token = createTestToken(invalidPayload);
    const result = isValidToken(token);
    expect(result).toBe(false);
  });

  test("## 5. type이 access가 아님 → false", () => {
    const invalidToken = { ...validPayload, type: "fail" };
    const token = createTestToken(invalidToken);
    const result = isValidToken(token);
    expect(result).toBe(false);
  });

  test("## 6. 토큰이 만료됨 → false", () => {
    const invalidPayload = {
      ...validPayload,
      exp: Math.floor(new Date("2025-12-31").getTime() / 1000),
    };
    const token = createTestToken(invalidPayload);
    const result = isValidToken(token);
    expect(result).toBe(false);
  });
});
