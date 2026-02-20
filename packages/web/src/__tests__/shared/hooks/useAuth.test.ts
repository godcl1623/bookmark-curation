import { renderHook, waitFor } from "@/__tests__/mock/utils";
import useAuth from "@/shared/hooks/useAuth";
import useAuthStore from "@/stores/auth";

describe("# useAuth 테스트", () => {
  // setup
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  test("## 1. accessToken이 없는 경우", async () => {
    // act
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // assert
    expect(result.current.user).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  test("## 2. accessToken이 있는 경우", async () => {
    // arrange
    useAuthStore.getState().setAccessToken("access-token");

    // act
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // assert
    expect(result.current.user).toEqual({
      id: 1,
      uuid: "aaaaa",
      email: "example@email.com",
      display_name: "test",
      avatar_url: "",
      locale: "",
    });
    expect(result.current.isError).toBe(false);
  });
});
