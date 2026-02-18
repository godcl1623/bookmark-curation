import { EXAMPLES } from "@/__tests__/__utils__";
import { server } from "@/__tests__/mock/node";
import { render, screen } from "@/__tests__/mock/utils";
import BookmarkDetail from "@/features/bookmarks/BookmarkList/components/BookmarkDetail";
import useEdit from "@/shared/hooks/useEdit";
import useAuthStore from "@/stores/auth";

vi.mock("@/shared/hooks/useEdit");
const useEditMock = vi.mocked(useEdit);

describe("description", () => {
  /** 테스트 계획
   * 1. 렌더링 테스트
   *   1-1. 기본 렌더링 테스트
   *   1-2. 수정 모드 렌더링 테스트
   * 2. 수정 모드 폼 입력 상호작용 테스트(AddBookmark 테스트 참조)
   * 3. 컴포넌트 수준에서의 폼 입력 테스트(AddBookmark 테스트 참조)
   */
  const mockResolve = vi.fn();
  const mockReject = vi.fn();
  const mockRefetch = vi.fn();
  const EXAMPLE = {
    URL: "https://www.example.com",
    TITLE: "Example Bookmark",
    NOTE: "Example Note",
  };

  beforeEach(() => {
    const modal = document.createElement("div");
    modal.setAttribute("id", "modal");
    document.body.appendChild(modal);
  });

  afterEach(() => {
    useAuthStore.getState().clearAuth();
    server.resetHandlers();
    const modal = document.getElementById("modal");
    if (modal?.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  });

  describe("# 1. 렌더링 테스트", () => {
    beforeEach(() => {
      useEditMock.mockReturnValue([false, vi.fn()]);
    });

    test("## 1-1. 일반 렌더링 테스트", async () => {
      /* arrange */
      render(
        <BookmarkDetail
          reject={mockReject}
          resolve={mockResolve}
          refetch={mockRefetch}
          {...EXAMPLES.BOOKMARK}
        />
      );

      /* act */
      const title = screen.getByRole("heading", {
        name: EXAMPLES.BOOKMARK.title,
      });
      const favoriteButton = screen.getByRole("button", { name: "favorite" });
      const domain = screen.getByRole("paragraph", { name: "domain" });
      const openLink = screen.getByRole("link");
      const description = screen.getByRole("paragraph", {
        name: "description",
      });
      const tagsList = screen.getByRole("list", { name: "tags" });
      const createdDate = screen.getByLabelText("date-created");
      const modifiedDate = screen.getByLabelText("date-modified");
      const shareButton = screen.getByRole("button", { name: "Share" });
      const editButton = screen.getByRole("button", { name: "Edit" });
      const deleteButton = screen.getByRole("button", { name: "Delete" });

      /* assert */
      expect(title).toBeInTheDocument();
      expect(favoriteButton).toBeInTheDocument();
      expect(domain).toBeInTheDocument();
      expect(openLink).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(tagsList).toBeInTheDocument();
      expect(createdDate).toBeInTheDocument();
      expect(modifiedDate).toBeInTheDocument();
      expect(shareButton).toBeInTheDocument();
      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });

    test("## 1-2. 수정 모드 렌더링 테스트", async () => {
      /* arrange */
      useEditMock.mockReturnValue([true, vi.fn()]);
      render(
        <BookmarkDetail
          reject={mockReject}
          resolve={mockResolve}
          refetch={mockRefetch}
          {...EXAMPLES.BOOKMARK}
        />
      );

      /* act */
      const titleInput = screen.getByRole("textbox", { name: "Title" });
      const folderButton = screen.getByRole("button", {
        name: "Folder (Optional)",
      });
      const urlInput = screen.getByRole("textbox", { name: "URL" });
      const noteTextbox = screen.getByRole("textbox", {
        name: "Note (Optional)",
      });
      const tagInput = screen.getByRole("textbox", { name: "Tags" });
      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      const submitButton = screen.getByRole("button", { name: "Submit" });

      /* assert */
      expect(titleInput).toBeInTheDocument();
      expect(folderButton).toBeInTheDocument();
      expect(urlInput).toBeInTheDocument();
      expect(noteTextbox).toBeInTheDocument();
      expect(tagInput).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe("# 2. 수정 모드에서의 폼 입력 상호작용 테스트", () => {
    // 폼 제출 테스트도 겸함

    test("## 2-1. 제목 입력", async () => {
      /* arrange */
      render(
        <BookmarkDetail
          reject={mockReject}
          resolve={mockResolve}
          refetch={mockRefetch}
          {...EXAMPLES.BOOKMARK}
        />
      );

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });

    test("## 2-2. 폴더 수정", async () => {
      /* arrange */
      render(
        <BookmarkDetail
          reject={mockReject}
          resolve={mockResolve}
          refetch={mockRefetch}
          {...EXAMPLES.BOOKMARK}
        />
      );

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });

    test("## 2-3. URL 입력 및 Paste", async () => {
      /* arrange */
      render(
        <BookmarkDetail
          reject={mockReject}
          resolve={mockResolve}
          refetch={mockRefetch}
          {...EXAMPLES.BOOKMARK}
        />
      );

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });

    test("## 2-4. 노트 입력", async () => {
      /* arrange */
      render(
        <BookmarkDetail
          reject={mockReject}
          resolve={mockResolve}
          refetch={mockRefetch}
          {...EXAMPLES.BOOKMARK}
        />
      );

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });

    describe("## 2-5. 태그 추가/제거 테스트", () => {
      test("### 2-5-1. 기존 목록에 새로운 태그 추가", async () => {
        /* arrange */
        render(
          <BookmarkDetail
            reject={mockReject}
            resolve={mockResolve}
            refetch={mockRefetch}
            {...EXAMPLES.BOOKMARK}
          />
        );

        /* act */

        /* assert */
        expect(result).toBe(expected);
      });

      test("### 2-5-2. 기존 태그 제거", async () => {
        /* arrange */
        render(
          <BookmarkDetail
            reject={mockReject}
            resolve={mockResolve}
            refetch={mockRefetch}
            {...EXAMPLES.BOOKMARK}
          />
        );

        /* act */

        /* assert */
        expect(result).toBe(expected);
      });
    });

    test("## 2-6. 종합 제출 테스트", async () => {
      /* arrange */
      render(
        <BookmarkDetail
          reject={mockReject}
          resolve={mockResolve}
          refetch={mockRefetch}
          {...EXAMPLES.BOOKMARK}
        />
      );

      /* act */

      /* assert */
      expect(result).toBe(expected);
    });
  });

  test("# 3. 북마크 삭제 테스트", async () => {
    /* arrange */
    render(
      <BookmarkDetail
        reject={mockReject}
        resolve={mockResolve}
        refetch={mockRefetch}
        {...EXAMPLES.BOOKMARK}
      />
    );

    /* act */

    /* assert */
    expect(result).toBe(expected);
  });
});
