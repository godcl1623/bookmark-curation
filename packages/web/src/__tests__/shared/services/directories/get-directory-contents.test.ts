import { EXAMPLES } from "@/__tests__/__utils__";
import getDirectoryContents from "@/shared/services/directories/get-directory-contents";

describe("# get-directory-contents 테스트", () => {
  test("## 1. 정상 호출 테스트", async () => {
    // act
    const result = await getDirectoryContents();

    // assert
    expect(result).toEqual({
      ok: true,
      data: {
        parent_id: 1,
        folders: [EXAMPLES.FOLDER],
        bookmarks: [EXAMPLES.BOOKMARK],
      },
    });
  });

  test("## 2. parentId가 null이 아닌 경우", async () => {
    // arrange
    const parentId = "parent-1";

    // act
    const result = await getDirectoryContents(parentId);

    // assert
    expect(result).toEqual({
      ok: true,
      data: {
        parent_id: 1,
        folders: [EXAMPLES.FOLDER],
        bookmarks: [EXAMPLES.BOOKMARK],
      },
    });
  });
});
