import { EXAMPLES } from "@/__tests__/__utils__";
import { renderHook, waitFor } from "@/__tests__/mock/utils";
import useBookmarksList from "@/shared/hooks/useBookmarksList";

describe("# useBookmarksList 테스트", () => {
  // setup

  test("## 1. 기본 호출 테스트", async () => {
    // arrange
    const { result } = renderHook(() => useBookmarksList());

    // act
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // assert
    expect(result.current).toMatchObject({
      data: [EXAMPLES.BOOKMARK],
      isLoading: false,
      isError: false,
      isRefetching: false,
    });
  });

  test("## 2. 옵션 전달 테스트", async () => {
    // arrange
    const search = "examples";
    const { result } = renderHook(() => useBookmarksList({ search }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // assert
    expect(result.current).toMatchObject({
      data: [],
      isLoading: false,
      isError: false,
      isRefetching: false,
    });
  });
});
