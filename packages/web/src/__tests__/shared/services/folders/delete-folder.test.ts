import type { AxiosResponse } from "axios";

import { EXAMPLES } from "@/__tests__/__utils__";
import deleteFolder from "@/shared/services/folders/delete-folder";

describe("# delete-folder 테스트", () => {
  test("## 1. 정상 호출 테스트", async () => {
    // act
    const result = (await deleteFolder("1")) as AxiosResponse;

    // assert
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ ok: true, data: EXAMPLES.FOLDER });
  });
});
