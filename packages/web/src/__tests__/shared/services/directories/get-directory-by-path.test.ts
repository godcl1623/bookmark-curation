import { EXAMPLES } from "@/__tests__/__utils__";
import getDirectoryByPath from "@/shared/services/directories/get-directory-by-path";

describe("# get-directory-by-path 테스트", () => {
  test("## 1. 정상 호출 테스트", async () => {
    // act
    const result = await getDirectoryByPath();

    // assert
    expect(result).toEqual({
      ok: true,
      data: {
        folder: EXAMPLES.FOLDER,
        folders: [EXAMPLES.FOLDER],
        bookmarks: [EXAMPLES.BOOKMARK],
        path: "/",
        breadcrumbs: {},
      },
    });
  });

  test("## 2. 별도 주소 호출 테스트", async () => {
    // arrange
    const pathname = "/test/directory";

    // act
    const result = await getDirectoryByPath(pathname);

    // assert
    expect(result).toEqual({
      ok: true,
      data: {
        folder: EXAMPLES.FOLDER,
        folders: [EXAMPLES.FOLDER],
        bookmarks: [EXAMPLES.BOOKMARK],
        path: "/",
        breadcrumbs: {},
      },
    });
  });
});
