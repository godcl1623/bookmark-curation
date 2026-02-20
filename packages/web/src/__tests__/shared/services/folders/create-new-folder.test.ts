import { EXAMPLES } from "@/__tests__/__utils__";
import createNewFolder from "@/shared/services/folders/create-new-folder";

describe("# create-new-folder 테스트", () => {
  test("## 1. 기본 호출 테스트", async () => {
    // act
    const result = await createNewFolder({});

    // assert
    expect(result).toEqual({
      ok: true,
      data: EXAMPLES.FOLDER,
    });
  });
});
