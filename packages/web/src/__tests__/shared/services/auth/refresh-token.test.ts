import { describe, expect, test } from "vitest";

import refreshToken from "@/shared/services/auth/refresh-token";
// import { render, screen } from "@testing-library/react";

describe("# refresh-token 테스트", () => {
  test("## 1. 정상 요청 테스트", async () => {
    // arrange
    const result = await refreshToken();

    // assert
    expect(result).toEqual({ access_token: "token", uuid: "aaaaa" });
  });
});
