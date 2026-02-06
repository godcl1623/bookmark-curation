import { EXAMPLES } from "@/__tests__/__utils__";
import getBookmarksList from "@/shared/services/bookmarks/get-bookmarks-list";

describe("# get-bookmarks-list 테스트", () => {
  test("## 1. 기본 호출 테스트", async () => {
    // act
    const result = await getBookmarksList();

    // assert
    expect(result).toEqual({
      ok: true,
      data: [EXAMPLES.BOOKMARK],
    });
  });

  test("## 2. 쿼리 옵션 전달 테스트", async () => {
    // arrange
    const options = {
      search: "search",
    };

    // act
    const result = await getBookmarksList(options);

    // assert
    expect(result).toEqual({
      ok: true,
      data: [EXAMPLES.BOOKMARK],
    });
  });
});
