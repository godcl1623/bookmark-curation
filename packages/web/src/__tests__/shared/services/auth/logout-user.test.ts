import { describe, expect, test } from "vitest";

import refreshToken from "@/shared/services/auth/logout-user";

describe("# logout-user 테스트", () => {
  test("## 1. 정상 호출 검증", async () => {
    // act
    const result = await refreshToken();

    // assert
    expect(result).toEqual({ message: "Logged out successfully" });
  });
});
