import { EXAMPLES } from "@/__tests__/__utils__";
import createNewTag from "@/shared/services/tags/create-new-tag";

describe("# create-new-tag 테스트", () => {
  test("## 1. 기본 호출 테스트", async () => {
    // act
    const result = await createNewTag({});

    // assert
    expect(result).toEqual({
      ok: true,
      data: EXAMPLES.TAG,
    });
  });

  test("## 2. body 검증 테스트", async () => {
    // arrange
    // act
    // assert
    // expect(result).toBe(expected);
  });
});
