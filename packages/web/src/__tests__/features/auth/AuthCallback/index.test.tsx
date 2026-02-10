import { render, screen, waitFor } from "@/__tests__/mock/utils";
import AuthCallback from "@/features/auth/AuthCallback";
import useAuthStore from "@/stores/auth";

// 1. 모킹 기능 선언
const mockNavigate = vi.hoisted(() => vi.fn());
const mockToastError = vi.hoisted(() => vi.fn());
const mockIsValidToken = vi.hoisted(() => vi.fn());
const mockLocationState = vi.hoisted(() => ({ hash: "", search: "" }));
const mockReplaceState = vi.hoisted(() => vi.fn());

// 2. react-router 모킹
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocationState,
}));

// 3. react-hot-toast 모킹
vi.mock("react-hot-toast", () => ({
  default: { error: mockToastError },
}));

// 4. 모바일 체크 모킹
let isMobileNative = false;
vi.mock("@/shared/lib/utils", () => ({
  checkIfMobileNative: () => isMobileNative,
}));

// 5. 토큰 검증 모킹
vi.mock("@/features/auth/AuthCallback/utils", () => ({
  isValidToken: (token: string) => mockIsValidToken(token),
}));

// 6. window.history 모킹
Object.defineProperty(window, "history", {
  value: { replaceState: mockReplaceState },
  writable: true,
});

import toast from "react-hot-toast";

describe("# AuthCallback 컴포넌트 테스트", () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
    mockNavigate.mockClear();
    mockToastError.mockClear();
    mockIsValidToken.mockClear();
    mockReplaceState.mockClear();
    mockLocationState.hash = "";
    mockLocationState.search = "";
  });

  test("## 1. 기본 렌더링 테스트", () => {
    /* arrange */
    // 대상 컴포넌트 렌더링
    render(<AuthCallback />);

    /* act */
    const paragraph = screen.getByText("로그인 처리 중...");

    /* assert */
    expect(paragraph).toBeInTheDocument();
  });

  describe("## 2. 웹 스코프 테스트", () => {
    test("### 2-1. 웹 + 유효한 토큰", async () => {
      /* arrange */
      // 해시로 토큰 전달된 상황 모킹
      mockLocationState.hash = "#access_token=token";
      mockIsValidToken.mockReturnValue(true);
      render(<AuthCallback />);

      /* assert */
      // 정상적으로 로그인이 진행되어 메인 화면으로 이동
      await waitFor(() => {
        expect(mockNavigate).toBeCalledWith("/", { replace: true });
        expect(mockReplaceState).toBeCalledWith({}, "", "/auth/callback");
      });
    });

    test("### 2-2. 웹 + hash 토큰 없음", async () => {
      /* arrange */
      render(<AuthCallback />);

      /* assert */
      await waitFor(() => {
        expect(mockNavigate).toBeCalledWith("/login", { replace: true });
        expect(toast.error).toBeCalledWith("올바르지 않은 접근입니다.");
      });
    });

    test("### 2-3. 웹 + 유효하지 않은 토큰", async () => {
      /* arrange */
      mockLocationState.hash = "#access_token=invalid_token";
      mockIsValidToken.mockReturnValue(false);
      render(<AuthCallback />);

      /* assert */
      await waitFor(() => {
        expect(mockNavigate).toBeCalledWith("/login", { replace: true });
        expect(toast.error).toBeCalledWith("올바르지 않은 접근입니다.");
      });
    });
  });

  describe("## 3. 모바일 스코프 테스트", () => {
    beforeEach(() => {
      isMobileNative = true;
    });

    test("### 3-1. 유효한 query 토큰", async () => {
      /* arrange */
      mockLocationState.search = "?mobile=true&token=access-token";
      mockIsValidToken.mockReturnValue(true);
      render(<AuthCallback />);

      /* assert */
      await waitFor(() => {
        expect(mockNavigate).toBeCalledWith("/", { replace: true });
        expect(mockReplaceState).toBeCalledWith({}, "", "/auth/callback");
      });
    });

    test("### 3-2. 유효하지 않은 토큰", async () => {
      /* arrange */
      mockLocationState.search = "?mobile=true";
      mockIsValidToken.mockReturnValue(false);
      render(<AuthCallback />);

      /* assert */
      await waitFor(() => {
        expect(mockNavigate).toBeCalledWith("/login", { replace: true });
        expect(toast.error).toBeCalledWith("올바르지 않은 접근입니다.");
      });
    });
  });

  test("## 4. 중복 실행 방지 테스트", async () => {});
});
