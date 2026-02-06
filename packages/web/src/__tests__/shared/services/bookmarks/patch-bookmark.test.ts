import { EXAMPLES } from "@/__tests__/__utils__";
import patchBookmark from "@/shared/services/bookmarks/patch-bookmark";

describe("# patch-bookmark 테스트", () => {
  test("## 1. 기본 호출 테스트", async () => {
    // act
    const result = await patchBookmark("target", {});

    // assert
    expect(result).toEqual({
      ok: true,
      data: EXAMPLES.BOOKMARK,
    });
  });
});
