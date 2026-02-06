import { EXAMPLES } from "@/__tests__/__utils__";
import updateFolder from "@/shared/services/folders/update-folder";

describe("# update-folder 테스트", () => {
  test("## 1. 정상 호출 테스트", async () => {
    // act
    const result = await updateFolder("target", {});

    // assert
    expect(result).toEqual({
      ok: true,
      data: EXAMPLES.FOLDER,
    });
  });

  test("## 2. body 입력 검증", async () => {
    // arrange
    // act
    // assert
    // expect(result).toBe(expected);
  });

  describe("## 3. 오류 유형별 테스트", () => {
    test("### 3-1. 400 오류", async () => {
      // arrange
      // act
      // assert
      // expect(result).toBe(expected);
    });

    test("### 3-2. 401 오류", async () => {
      // arrange
      // act
      // assert
      // expect(result).toBe(expected);
    });

    test("### 3-3. 500 오류", async () => {
      // arrange
      // act
      // assert
      // expect(result).toBe(expected);
    });
  });
});
