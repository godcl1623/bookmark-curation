import { EXAMPLES } from "@/__tests__/__utils__";
import updateTag from "@/shared/services/tags/update-tag";

describe("# update-tag 테스트", () => {
  test("## 1. 기본 호출 테스트", async () => {
    // act
    const result = await updateTag("target", {});

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

  describe("## 3. 에러 테스트", () => {
    test("### 3-1. 400 테스트", async () => {
      // arrange
      // act
      // assert
      // expect(result).toBe(expected);
    });

    test("### 3-2. 401 테스트", async () => {
      // arrange
      // act
      // assert
      // expect(result).toBe(expected);
    });

    test("### 3-3. 403 테스트", async () => {
      // arrange
      // act
      // assert
      // expect(result).toBe(expected);
    });

    test("### 3-4. 404 테스트", async () => {
      // arrange
      // act
      // assert
      // expect(result).toBe(expected);
    });

    test("### 3-5. 500 테스트", async () => {
      // arrange
      // act
      // assert
      // expect(result).toBe(expected);
    });
  });
});
