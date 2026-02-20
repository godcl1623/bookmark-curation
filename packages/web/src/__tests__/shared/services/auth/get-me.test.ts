import getMe from "@/shared/services/auth/get-me";

describe("# get-me 테스트", () => {
  test("## 1. 기본 동작 테스트", async () => {
    // arrange
    const result = await getMe();

    // assert
    expect(result).toMatchObject({
      user: {
        id: 1,
        uuid: "aaaaa",
        email: "example@email.com",
        display_name: "test",
        avatar_url: "",
        locale: "",
      },
    });
  });
});
