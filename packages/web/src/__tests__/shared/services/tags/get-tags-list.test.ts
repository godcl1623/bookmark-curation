import { EXAMPLES } from "@/__tests__/__utils__";
import getTagsList from "@/shared/services/tags/get-tags-list";

describe("# get-tags-list 테스트", () => {
  test("## 1. 기본 호출 테스트", async () => {
    // arrange
    const options = {};

    // act
    const result = await getTagsList(options);

    // assert
    expect(result).toEqual({
      ok: true,
      data: [EXAMPLES.TAG],
    });
  });

  describe("## 2. options 테스트", () => {
    test("### 2-1. options.search 입력", async () => {
      // arrange
      // act
      // assert
      // expect(result).toBe(expected);
    });

    test("### 2-2. options.sort_by 입력", async () => {
      // arrange
      // act
      // assert
      // expect(result).toBe(expected);
    });

    test("### 2-3. options.limit 입력", async () => {
      // arrange
      // act
      // assert
      // expect(result).toBe(expected);
    });

    test("### 2-4. 전체 옵션 입력", async () => {
      // arrange
      // act
      // assert
      // expect(result).toBe(expected);
    });
  });
});
