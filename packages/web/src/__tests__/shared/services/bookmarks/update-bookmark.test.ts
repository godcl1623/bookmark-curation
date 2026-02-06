import { EXAMPLES } from "@/__tests__/__utils__";
import updateBookmark from "@/shared/services/bookmarks/update-bookmark";

describe("# update-bookmark 테스트", () => {
  test("## 1. 정상 호출 테스트", async () => {
    // act
    const result = await updateBookmark("target", {});

    // assert
    expect(result).toEqual({
      ok: true,
      data: EXAMPLES.BOOKMARK,
    });
  });
});
