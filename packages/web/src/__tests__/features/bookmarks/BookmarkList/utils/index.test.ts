import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import { http, HttpResponse } from "msw";

import { server } from "@/__tests__/mock/node";
import handleFavorite from "@/features/bookmarks/BookmarkList/utils";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import toast from "react-hot-toast";

describe("# handleFavorite 테스트", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("## 1. 성공 시나리오 테스트", () => {
    test("## 1-1. 즐겨찾기 추가 성공", async () => {
      const mockSuccessCallback = vi.fn();
      const handler = handleFavorite("1", false, mockSuccessCallback);
      await handler();

      expect(toast.success).toHaveBeenCalledWith("즐겨찾기에 추가했습니다.");
      expect(mockSuccessCallback).toHaveBeenCalled();
    });

    test("## 1-2. 즐겨찾기 제거 성공", async () => {
      const mockSuccessCallback = vi.fn();
      const handler = handleFavorite("1", true, mockSuccessCallback);
      await handler();

      expect(toast.success).toHaveBeenCalledWith("즐겨찾기에서 제거했습니다.");
      expect(mockSuccessCallback).toHaveBeenCalled();
    });

    test("## 1-3. 즐겨찾기 추가 성공 + successCallback 없는 경우", async () => {
      const handler = handleFavorite("1", false);
      await handler();

      expect(toast.success).toHaveBeenCalledWith("즐겨찾기에 추가했습니다.");
    });
  });

  describe("## 2. 실패 시나리오 테스트", () => {
    test("## 1-1. AxiosError 400", async () => {
      const errorMessage = "즐겨찾기 상태를 변경하지 못했습니다. (400)";
      errorGenerator(errorMessage, 400);

      const handler = handleFavorite("1", false);
      await handler();

      expect(toast.error).toHaveBeenLastCalledWith(errorMessage);
      expect(console.error).toHaveBeenCalled();
    });

    test("## 1-2. AxiosError 401", async () => {
      const errorMessage = "즐겨찾기 상태를 변경하지 못했습니다. (403)";
      errorGenerator(errorMessage, 403);

      const handler = handleFavorite("1", false);
      await handler();

      expect(toast.error).toHaveBeenLastCalledWith(errorMessage);
      expect(console.error).toHaveBeenCalled();
    });

    test("## 1-3. AxiosError 500", async () => {
      const errorMessage = "즐겨찾기 상태를 변경하지 못했습니다. (500)";
      errorGenerator(errorMessage, 500);

      const handler = handleFavorite("1", false);
      await handler();

      expect(toast.error).toHaveBeenLastCalledWith(errorMessage);
      expect(console.error).toHaveBeenCalled();
    });

    test("## 1-4. 일반 에러", async () => {
      const errorMessage = "즐겨찾기 상태를 변경하지 못했습니다. (500)";
      errorGenerator(errorMessage, 500, true);

      const handler = handleFavorite("1", false);
      await handler();

      expect(toast.error).toHaveBeenLastCalledWith(errorMessage);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("## 3. 엣지 케이스 테스트", () => {
    test("## 1-1. result.ok가 false", async () => {
      server.use(
        http.patch(
          `${import.meta.env.VITE_API_URL ?? "http://localhost:3002"}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}/:id`,
          () => {
            return HttpResponse.json({ ok: false });
          }
        )
      );
      const mockSuccessCallback = vi.fn();

      const handler = handleFavorite("1", false, mockSuccessCallback);
      await handler();

      expect(toast.error).toHaveBeenCalledWith(
        "즐겨찾기 상태를 변경하지 못했습니다. (Error)"
      );
      expect(mockSuccessCallback).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    test("## 1-2. 동일한 상태를 여러 번 호출", async () => {
      const mockSuccessCallback = vi.fn();
      const handler = handleFavorite("1", false, mockSuccessCallback);
      await handler();
      await handler();
      await handler();

      expect(toast.success).toHaveBeenCalledWith("즐겨찾기에 추가했습니다.");
      expect(mockSuccessCallback).toHaveBeenCalled();
    });
  });
});

const errorGenerator = (
  message: string,
  status: number,
  isNormalError: boolean = false
) => {
  server.use(
    http.patch(
      `${import.meta.env.VITE_API_URL ?? "http://localhost:3002"}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}/:id`,
      () => {
        if (isNormalError) throw new Error(message);
        return HttpResponse.json({ message }, { status });
      }
    )
  );
};
