import refreshToken from "@/shared/services/auth/refresh-token";

describe("# refresh-token 테스트", () => {
  test("## 1. 정상 요청 테스트", async () => {
    // arrange
    const result = await refreshToken();

    // assert
    expect(result).toEqual({ access_token: "token", uuid: "aaaaa" });
  });
});
