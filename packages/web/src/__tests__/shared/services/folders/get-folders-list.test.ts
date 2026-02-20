import { EXAMPLES } from "@/__tests__/__utils__";
import getFoldersList from "@/shared/services/folders/get-folders-list";

describe("# get-folders-list 테스트", () => {
  test("## 1. 기본 호출 테스트", async () => {
    // act
    const result = await getFoldersList();

    // assert
    expect(result).toEqual({
      ok: true,
      data: [EXAMPLES.FOLDER],
    });
  });
});
