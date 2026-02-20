import { EXAMPLES } from "@/__tests__/__utils__";
import { renderHook, waitFor } from "@/__tests__/mock/utils";
import useDirectoriesData from "@/shared/hooks/useDirectoriesData";
import useAuthStore from "@/stores/auth";

describe("# useDirectoriesData 테스트", () => {
  // setup
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  const setToken = (token: string | null = null) =>
    useAuthStore.getState().setAccessToken(token);

  test("## 1. 기본 호출 테스트", async () => {
    // arrange
    const path = "/";
    setToken("access-token");

    // act
    const { result } = renderHook(() => useDirectoriesData(path));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // assert
    expect(result.current.data).toEqual({
      folder: EXAMPLES.FOLDER,
      folders: [EXAMPLES.FOLDER],
      bookmarks: [EXAMPLES.BOOKMARK],
      path: "/",
      breadcrumbs: {},
    });
  });

  describe("## 2. null이 반환되는 경우 테스트", () => {
    test("### 2-1. shouldLoad가 false인 경우", async () => {
      // arrange
      const path = "/";
      setToken("access-token");

      // act
      const { result } = renderHook(() => useDirectoriesData(path, false));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // assert
      expect(result.current.data).toBeUndefined();
    });

    test("### 2-2. accessToken이 null인 경우", async () => {
      // arrange
      const path = "/";

      // act
      const { result } = renderHook(() => useDirectoriesData(path));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // assert
      expect(result.current.data).toBeUndefined();
    });

    test("### 2-3. 2-1, 2-2 종합", async () => {
      // arrange
      const path = "/";

      // act
      const { result } = renderHook(() => useDirectoriesData(path, false));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // assert
      expect(result.current.data).toBeUndefined();
    });
  });

  describe("## 3. 다른 주소로의 요청 테스트", () => {
    test("### 3-1. 다른 주소로의 요청 단순 테스트", async () => {
      // arrange
      const path = "/Favorites";
      setToken("access-token");

      // act
      const { result } = renderHook(() => useDirectoriesData(path));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // assert
      expect(result.current.data).toEqual({
        folder: EXAMPLES.FOLDER,
        folders: [EXAMPLES.FOLDER],
        bookmarks: [EXAMPLES.BOOKMARK],
        path,
        breadcrumbs: {},
      });
    });
  });

  test("### 3-2. 주소 변경시 쿼리 재실행 테스트", async () => {
    // arrange
    let path = "/";
    setToken("access-token");

    // act
    const { result, rerender } = renderHook(
      ({ path }: { path: string }) => useDirectoriesData(path),
      { initialProps: { path } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // assert
    expect(result.current.data).toEqual({
      folder: EXAMPLES.FOLDER,
      folders: [EXAMPLES.FOLDER],
      bookmarks: [EXAMPLES.BOOKMARK],
      path: "/",
      breadcrumbs: {},
    });

    // act
    path = "/Favorites";
    rerender({ path });
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // assert
    expect(result.current.data).toEqual({
      folder: EXAMPLES.FOLDER,
      folders: [EXAMPLES.FOLDER],
      bookmarks: [EXAMPLES.BOOKMARK],
      path: "/Favorites",
      breadcrumbs: {},
    });
  });
});
