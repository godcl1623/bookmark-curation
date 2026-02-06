import type { AxiosResponse } from "axios";

import { EXAMPLES } from "@/__tests__/__utils__";
import deleteBookmark from "@/shared/services/bookmarks/delete-bookmark";

describe("# delete-bookmark 테스트", () => {
  test("## 1. 정상 호출 테스트", async () => {
    // act
    const result = (await deleteBookmark("1")) as AxiosResponse<
      typeof EXAMPLES.BOOKMARK
    >;

    // assert
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ ok: true, data: EXAMPLES.BOOKMARK });
  });
});
