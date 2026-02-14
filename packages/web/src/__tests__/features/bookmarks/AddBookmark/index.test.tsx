import { render, screen } from "@/__tests__/mock/utils";
import AddBookmark from "@/features/bookmarks/AddBookmark";
import { BOOKMARK_FORM_ELEMENTS } from "@/shared/consts";
import useGlobalStore from "@/stores/global";

describe("# AddBookmark 테스트", () => {
  const resolve = vi.fn();
  const reject = vi.fn();

  beforeEach(() => {
    useGlobalStore.getState().__resetStore();
  });

  describe("## 1. 기본 렌더링 테스트", () => {
    test("### 1-1. 전체 폼 요소 렌더링 테스트", async () => {
      /* arrange */
      render(<AddBookmark resolve={resolve} reject={reject} />);

      /* act */
      const urlInput = screen.getByRole("textbox", {
        name: BOOKMARK_FORM_ELEMENTS.URL,
      });
      const titleInput = screen.getByRole("textbox", {
        name: BOOKMARK_FORM_ELEMENTS.TITLE,
      });
      const noteTextarea = screen.getByRole("textbox", {
        name: BOOKMARK_FORM_ELEMENTS.NOTE + " (Optional)",
      });
      const tagInput = screen.getByRole("textbox", {
        name: "Tags",
      });
      const folderButton = screen.getByRole("button", {
        name: "없음",
      });

      /* assert */
      expect(urlInput).toBeInTheDocument();
      expect(titleInput).toBeInTheDocument();
      expect(noteTextarea).toBeInTheDocument();
      expect(tagInput).toBeInTheDocument();
      expect(folderButton).toBeInTheDocument();
    });
  });

  describe("## 2. 폼 입력 상호작용 테스트", () => {
    test("### 2-1. URL 입력 및 Paste", async () => {
      /* arrange */

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });

    test("### 2-2. 제목 입력", async () => {
      /* arrange */

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });

    test("### 2-3. 노트 입력", async () => {
      /* arrange */

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });

    test("### 2-4. 태그 추가/제거", async () => {
      /* arrange */

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });

    test("### 2-5. 폴더 선택", async () => {
      /* arrange */

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });
  });

  describe("## 3. 폼 검증 테스트", () => {
    test("### 3-1. 유효한 데이터로 폼 제출", async () => {
      /* arrange */

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });

    test("### 3-2. URL 누락시 에러 표시", async () => {
      /* arrange */

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });

    test("### 3-3. 제목 길이 초과", async () => {
      /* arrange */

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });

    test("### 3-4. 노트 길이 초과", async () => {
      /* arrange */

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });
  });

  describe("## 4. API 통합 테스트", () => {
    test("### 4-1. 북마크 생성 성공", async () => {
      /* arrange */

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });

    test("### 4-2. API 실패시 에러 처리", async () => {
      /* arrange */

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });

    test("### 4-3. 성공/실패 후 모달 닫힘", async () => {
      /* arrange */

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });

    test("### 4-4. 데이터 refetch 호출 확인", async () => {
      /* arrange */

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });
  });
});
