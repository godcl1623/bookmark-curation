import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import { BASE_URL, EXAMPLES } from "@/__tests__/__utils__";
import { server } from "@/__tests__/mock/node";
import { render, screen, waitFor, within } from "@/__tests__/mock/utils";
import BookmarkDetail from "@/features/bookmarks/BookmarkList/components/BookmarkDetail";
import useEdit from "@/shared/hooks/useEdit";
import useFolderList from "@/shared/hooks/useFolderList";
import { readClipboard } from "@/shared/lib/mobile/clipboard";
import useAuthStore from "@/stores/auth";

vi.mock("@/shared/hooks/useEdit");
const useEditMock = vi.mocked(useEdit);

vi.mock("@/shared/hooks/useFolderList");
const useFolderListMock = vi.mocked(useFolderList);

vi.mock("@/shared/lib/mobile/clipboard");

const successToastMock = vi.hoisted(() => vi.fn());
const errorToastMock = vi.hoisted(() => vi.fn());
vi.mock("react-hot-toast", () => ({
  default: {
    success: successToastMock,
    error: errorToastMock,
  },
}));

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
      useFolderListMock.mockReturnValue({
        data: [EXAMPLES.FOLDER],
        isLoading: false,
        isError: false,
        isRefetching: false,
        refetch: vi.fn(),
      });
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
    beforeEach(() => {
      useEditMock.mockReturnValue([true, vi.fn()]);
      useFolderListMock.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        isRefetching: false,
        refetch: vi.fn(),
      });
    });

    test("## 2-1. 제목 입력", async () => {
      /* arrange */
      const user = userEvent.setup();
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
      await user.clear(titleInput);
      await user.type(titleInput, EXAMPLE.TITLE);

      /* assert */
      expect(titleInput).toHaveValue(EXAMPLE.TITLE);
    });

    test("## 2-2. 폴더 수정", async () => {
      /* arrange */
      useFolderListMock.mockReturnValue({
        data: [EXAMPLES.FOLDER],
        isLoading: false,
        isError: false,
        isRefetching: false,
        refetch: vi.fn(),
      });
      const user = userEvent.setup();
      render(
        <BookmarkDetail
          reject={mockReject}
          resolve={mockResolve}
          refetch={mockRefetch}
          {...EXAMPLES.BOOKMARK}
        />
      );

      /* act & assert */
      // 폴더 버튼 클릭
      const folderButton = screen.getByRole("button", {
        name: "Folder (Optional)",
      });
      await user.click(folderButton);

      // select 목록에서 폴더 버튼 클릭
      await waitFor(async () => {
        const options = screen.getByRole("list", { name: "modal-option" });
        expect(options).toBeInTheDocument();

        const targetButton = screen.getByRole("button", { name: "folder" });
        expect(targetButton).toBeInTheDocument();

        await user.click(targetButton);
        expect(options).not.toBeInTheDocument();
      });

      expect(folderButton).toHaveTextContent("folder");
    });

    test("## 2-3. URL 입력 및 Paste", async () => {
      /* arrange */
      const user = userEvent.setup();
      render(
        <BookmarkDetail
          reject={mockReject}
          resolve={mockResolve}
          refetch={mockRefetch}
          {...EXAMPLES.BOOKMARK}
        />
      );

      /* act & assert 1 */
      // url 수동 입력 테스트
      let urlInput = screen.getByRole("textbox", { name: "URL" });
      await user.clear(urlInput);
      await user.type(urlInput, EXAMPLE.URL);
      expect(urlInput).toHaveValue(EXAMPLE.URL);

      /* act & assert 2 */
      // 붙여넣기 버튼 클릭
      await user.clear(urlInput);
      const pasteButton = screen.getByRole("button", { name: "paste_url" });
      vi.mocked(readClipboard).mockResolvedValue(EXAMPLE.URL);
      await user.click(pasteButton);

      await waitFor(() => {
        urlInput = screen.getByRole("textbox", { name: "URL" });
        expect(urlInput).toHaveValue(EXAMPLE.URL);
        expect(successToastMock).toBeCalledWith(
          "클립보드에서 URL을 불러왔습니다."
        );
      });
    });

    test("## 2-4. 노트 입력", async () => {
      /* arrange */
      const user = userEvent.setup();
      render(
        <BookmarkDetail
          reject={mockReject}
          resolve={mockResolve}
          refetch={mockRefetch}
          {...EXAMPLES.BOOKMARK}
        />
      );

      /* act */
      const noteTextbox = screen.getByRole("textbox", {
        name: "Note (Optional)",
      });
      await user.clear(noteTextbox);
      await user.type(noteTextbox, EXAMPLE.NOTE);

      /* assert */
      expect(noteTextbox).toHaveValue(EXAMPLE.NOTE);
    });

    describe("## 2-5. 태그 추가/제거 테스트", () => {
      test("### 2-5-1. 기존 목록에 새로운 태그 추가", async () => {
        /* arrange */
        const user = userEvent.setup();
        render(
          <BookmarkDetail
            reject={mockReject}
            resolve={mockResolve}
            refetch={mockRefetch}
            {...EXAMPLES.BOOKMARK}
          />
        );

        /* act & assert 1 */
        // 태그 입력 후 검색 테스트
        const tagInput = screen.getByRole("textbox", { name: "Tags" });
        await user.clear(tagInput);
        await user.type(tagInput, "tag");
        const listItem = screen.getAllByRole("listitem", {
          name: /^searched_items_/i,
        });
        await waitFor(() => {
          expect(listItem[0]).toHaveTextContent("tag");
        });

        /* act & assert 2 */
        // 태그 추가 테스트
        const searchedTag = screen.getByRole("button", { name: "tag_tag" });
        await user.click(searchedTag);
        const addedTags = screen.getByRole("list", { name: "added_tags_list" });
        expect(addedTags.children).toHaveLength(1);
      });

      test("### 2-5-2. 기존 태그 제거", async () => {
        /* arrange */
        const user = userEvent.setup();
        render(
          <BookmarkDetail
            reject={mockReject}
            resolve={mockResolve}
            refetch={mockRefetch}
            {...{
              data_id: "1",
              title: "title",
              url: "url",
              description: "description",
              metadata: {},
              parent_id: null,
              domain: "",
              favicon_url: "",
              preview_image: "",
              is_favorite: false,
              is_archived: false,
              is_private: false,
              type: "bookmark",
              folders: null,
              click_count: 0,
              created_at: "",
              deleted_at: "",
              id: 1,
              parent: null,
              position: 0,
              tags: [
                {
                  name: "tag",
                  color: "#000000",
                  created_at: "",
                  deleted_at: "",
                  id: 1,
                  slug: "tag",
                  updated_at: "",
                  user_id: 1,
                  users: { id: 1, display_name: "user" },
                  _count: { bookmark_tags: 0 },
                },
              ],
              updated_at: "",
              user_id: 1,
              view_count: 0,
              users: { id: 1, display_name: "user" },
              _count: { bookmarks: 0, children: 0 },
            }}
          />
        );

        /* act & assert 1 */
        // 태그 렌더링 테스트
        const addedTags = screen.getByRole("list", { name: "added_tags_list" });
        expect(addedTags.children).toHaveLength(1);

        /* act & assert 2 */
        const tagItem = screen.getByText("#tag");
        expect(tagItem).toBeInTheDocument();
        const removeButton = within(tagItem).getByRole("button");
        await user.click(removeButton);
        expect(addedTags.children).toHaveLength(0);
      });
    });

    test("## 2-6. 종합 제출 테스트", async () => {
      /* arrange */
      let captureBody: unknown;
      server.use(
        http.put(
          `${BASE_URL}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}/:target`,
          async ({ request }) => {
            captureBody = await request.json();
            return HttpResponse.json({
              ok: true,
              data: {
                ...(captureBody as Record<string, unknown>),
              },
            });
          }
        )
      );
      useFolderListMock.mockReturnValue({
        data: [EXAMPLES.FOLDER],
        isLoading: false,
        isError: false,
        isRefetching: false,
        refetch: vi.fn(),
      });
      const user = userEvent.setup();
      render(
        <BookmarkDetail
          reject={mockReject}
          resolve={mockResolve}
          refetch={mockRefetch}
          {...EXAMPLES.BOOKMARK}
        />
      );

      /* act */
      // 요소 정의
      const titleInput = screen.getByRole("textbox", { name: "Title" });
      const folderButton = screen.getByRole("button", {
        name: "Folder (Optional)",
      });
      const urlInput = screen.getByRole("textbox", { name: "URL" });
      const noteTextbox = screen.getByRole("textbox", {
        name: "Note (Optional)",
      });
      const tagInput = screen.getByRole("textbox", { name: "Tags" });
      const submitButton = screen.getByRole("button", { name: "Submit" });

      // 제목 수정
      await user.clear(titleInput);
      await user.type(titleInput, EXAMPLE.TITLE);

      // 폴더 추가
      await user.click(folderButton);
      await waitFor(async () => {
        const targetButton = screen.getByRole("button", { name: "folder" });
        await user.click(targetButton);
      });

      // URL 수정
      await user.clear(urlInput);
      await user.type(urlInput, EXAMPLE.URL);

      // 노트 수정
      await user.clear(noteTextbox);
      await user.type(noteTextbox, EXAMPLE.NOTE);

      // 태그 추가
      await user.clear(tagInput);
      await user.type(tagInput, "tag");
      const listItem = screen.getAllByRole("listitem", {
        name: /^searched_items_/i,
      });
      await waitFor(() => {
        expect(listItem[0]).toHaveTextContent("tag");
      });
      const searchedTag = screen.getByRole("button", { name: "tag_tag" });
      await user.click(searchedTag);

      await user.click(submitButton);

      /* assert */
      await waitFor(() => {
        expect(successToastMock).toHaveBeenCalledWith(
          "북마크를 성공적으로 수정했습니다."
        );
        expect(captureBody).toMatchObject({
          title: EXAMPLE.TITLE,
          url: EXAMPLE.URL,
          description: EXAMPLE.NOTE,
        });
      });
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
