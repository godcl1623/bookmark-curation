import { EXAMPLES } from "@/__tests__/__utils__";
import createNewBookmark from "@/shared/services/bookmarks/create-new-bookmark";

describe("# create-new-bookmark 테스트", () => {
  test("## 1. 정상 호출 테스트", async () => {
    // arrange
    const result = await createNewBookmark({});

    // assert
    expect(result).toEqual({
      ok: true,
      data: EXAMPLES.BOOKMARK,
    });
  });
});
