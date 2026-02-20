import type { AxiosResponse } from "axios";

import { EXAMPLES } from "@/__tests__/__utils__";
import deleteTag from "@/shared/services/tags/delete-tag";

describe("# delete-tag 테스트", () => {
  test("## 1. 기본 호출 테스트", async () => {
    // act
    const result = (await deleteTag("1")) as AxiosResponse;

    // assert
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ ok: true, data: EXAMPLES.TAG });
  });

  test("## 2. 에러 테스트", async () => {
    // arrange
    // act
    // assert
    // expect(result).toBe(expected);
  });
});
