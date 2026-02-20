import userEvent from "@testing-library/user-event";

import { act, render, screen, waitFor, within } from "@/__tests__/mock/utils";
import AddBookmark from "@/features/bookmarks/AddBookmark";
import { BOOKMARK_FORM_ELEMENTS } from "@/shared/consts";
import useGlobalStore from "@/stores/global";

const mockSuccessToast = vi.hoisted(() => vi.fn());
const mockErrorToast = vi.hoisted(() => vi.fn());

vi.mock("@/shared/lib/mobile/clipboard");
vi.mock("react-hot-toast", () => ({
  default: {
    success: mockSuccessToast,
    error: mockErrorToast,
  },
}));

import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import { http, HttpResponse } from "msw";

import { BASE_URL } from "@/__tests__/__utils__";
import { server } from "@/__tests__/mock/node";
import AddTags from "@/features/bookmarks/AddBookmark/components/AddTags";
import { readClipboard } from "@/shared/lib/mobile/clipboard";
import useAuthStore from "@/stores/auth";

describe("# AddBookmark 테스트", () => {
  const resolve = vi.fn();
  const reject = vi.fn();
  const EXAMPLE = {
    URL: "https://www.example.com",
    TITLE: "Example Bookmark",
    NOTE: "Example Note",
  };

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
      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      const saveButton = screen.getByRole("button", { name: "Save Bookmark" });

      /* assert */
      expect(urlInput).toBeInTheDocument();
      expect(titleInput).toBeInTheDocument();
      expect(noteTextarea).toBeInTheDocument();
      expect(tagInput).toBeInTheDocument();
      expect(folderButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
      expect(saveButton).toBeInTheDocument();
    });
  });

  describe("## 2. 폼 입력 상호작용 테스트", () => {
    test("### 2-1. URL 입력 및 Paste", async () => {
      /* arrange */
      const user = userEvent.setup();
      render(<AddBookmark resolve={resolve} reject={reject} />);

      /* act 1 */
      let urlInput = screen.getByRole("textbox", {
        name: BOOKMARK_FORM_ELEMENTS.URL,
      });
      await user.clear(urlInput);
      await user.type(urlInput, EXAMPLE.URL);

      /* assert 1 */
      await waitFor(() => {
        expect(urlInput).toHaveValue(EXAMPLE.URL);
      });

      /* act 2 */
      await user.clear(urlInput);
      vi.mocked(readClipboard).mockResolvedValue(EXAMPLE.URL);
      const pasteButton = screen.getByRole("button", { name: "paste_url" });
      await user.click(pasteButton);

      /* assert 2 */
      await waitFor(() => {
        urlInput = screen.getByRole("textbox", {
          name: BOOKMARK_FORM_ELEMENTS.URL,
        });
        expect(urlInput).toHaveValue(EXAMPLE.URL);
        expect(mockSuccessToast).toBeCalledWith(
          "클립보드에서 URL을 불러왔습니다."
        );
      });
    });

    test("### 2-2. 제목 입력", async () => {
      /* arrange */
      const user = userEvent.setup();
      render(<AddBookmark resolve={resolve} reject={reject} />);

      /* act */
      const titleInput = screen.getByRole("textbox", {
        name: BOOKMARK_FORM_ELEMENTS.TITLE,
      });
      await user.clear(titleInput);
      await user.type(titleInput, EXAMPLE.TITLE);

      /* assert */
      await waitFor(() => {
        expect(titleInput).toHaveValue(EXAMPLE.TITLE);
      });
    });

    test("### 2-3. 노트 입력", async () => {
      /* arrange */
      const user = userEvent.setup();
      render(<AddBookmark resolve={resolve} reject={reject} />);

      /* act */
      const noteTextarea = screen.getByRole("textbox", {
        name: BOOKMARK_FORM_ELEMENTS.NOTE + " (Optional)",
      });
      await user.clear(noteTextarea);
      await user.type(noteTextarea, EXAMPLE.NOTE);

      /* assert */
      await waitFor(() => {
        expect(noteTextarea).toHaveValue(EXAMPLE.NOTE);
      });
    });

    describe("### 2-4. 태그 추가/제거 테스트", () => {
      test("#### 2-4-1. 기본 목록이 비어있는 경우의 태그 추가 및 제거 테스트", async () => {
        /* arrange */
        const user = userEvent.setup();
        render(
          <AddTags
            input={({ value, onClick, onChange }) => (
              <input
                value={value}
                placeholder={"Add tags..."}
                onClick={onClick}
                onChange={onChange}
              />
            )}
          />
        );

        /* act 1 */
        const tagInput = screen.getByRole("textbox", {
          name: "Tags",
        });
        await user.clear(tagInput);
        await user.type(tagInput, "tag");
        const listItem = screen.getAllByRole("listitem", {
          name: /^searched_items_/i,
        });

        /* assert 1 */
        await waitFor(() => {
          expect(listItem[0]).toHaveTextContent("tag");
        });

        /* act 2 */
        const searchedTag = screen.getByRole("button", { name: "tag_tag" });
        await user.click(searchedTag);
        const addedTags = screen.getByRole("list", { name: "added_tags_list" });

        /* assert 2 */
        expect(addedTags.children).toHaveLength(1);
      });

      test("#### 2-4-2. 기본 목록이 있는 경우의 태그 추가 및 제거 테스트", async () => {
        /* arrange */
        const user = userEvent.setup();
        render(
          <AddTags
            input={({ value, onClick, onChange }) => (
              <input
                value={value}
                placeholder={"Add tags..."}
                onClick={onClick}
                onChange={onChange}
              />
            )}
            initialList={[
              {
                name: "tag 1",
                color: "#000000",
                created_at: "",
                deleted_at: "",
                id: 2,
                slug: "tag_1",
                updated_at: "",
                user_id: 1,
                users: { id: 1, display_name: "user" },
                _count: { bookmark_tags: 0 },
              },
              {
                name: "tag 2",
                color: "#000000",
                created_at: "",
                deleted_at: "",
                id: 3,
                slug: "tag_2",
                updated_at: "",
                user_id: 1,
                users: { id: 1, display_name: "user" },
                _count: { bookmark_tags: 0 },
              },
            ]}
          />
        );

        /* act 1 */
        const addedTags = screen.getByRole("list", { name: "added_tags_list" });

        /* assert 1 */
        expect(addedTags.children).toHaveLength(2);

        /* act 2 */
        const tagInput = screen.getByRole("textbox", {
          name: "Tags",
        });
        await user.clear(tagInput);
        await user.type(tagInput, "tag");
        const listItem = screen.getAllByRole("listitem", {
          name: /^searched_items_/i,
        });

        /* assert 2 */
        await waitFor(() => {
          expect(listItem[0]).toHaveTextContent("tag");
        });

        /* act 3 */
        const searchedTag = screen.getByRole("button", { name: "tag_tag" });
        await user.click(searchedTag);

        /* assert 3 */
        expect(addedTags.children).toHaveLength(3);
      });
    });

    describe("### 2-5. 폴더 선택 테스트", () => {
      beforeEach(() => {
        useAuthStore.getState().setAccessToken("access-token");
        const modal = document.createElement("div");
        modal.setAttribute("id", "modal");
        document.body.appendChild(modal);
      });

      afterEach(() => {
        useAuthStore.getState().clearAuth();
        const modal = document.getElementById("modal");
        if (modal?.parentNode) {
          modal?.parentNode.removeChild(modal);
        }
        server.resetHandlers();
      });

      test("#### 2-5-1. 데이터가 없는 상태에서 폴더 선택", async () => {
        /* arrange */
        server.use(
          http.get(`${BASE_URL}${SERVICE_ENDPOINTS.FOLDERS.path}`, () => {
            return HttpResponse.json({
              ok: true,
              data: [],
            });
          })
        );
        const user = userEvent.setup();
        render(<AddBookmark resolve={resolve} reject={reject} />);
        await act(async () => {});

        /* act 1 */
        const folderButton = screen.getByRole("button", {
          name: "없음",
        });
        await user.click(folderButton);

        /* assert 1 */
        await waitFor(() => {
          const optionModal = screen.getByRole("list", {
            name: "modal-option",
          });
          const folderItems = optionModal.children;
          expect(optionModal).toBeInTheDocument();
          expect(folderItems).toHaveLength(1);
        });

        /* act 2 */
        const optionModal = screen.getByRole("list", {
          name: "modal-option",
        });
        const targetButton = within(optionModal).getByRole("button", {
          name: "없음",
        });
        await user.click(targetButton);

        /* assert 2 */
        expect(targetButton).toHaveTextContent("없음");
      });

      test("#### 2-5-2. 데이터가 있는 상태에서 폴더 선택", async () => {
        /* arrange */
        const user = userEvent.setup();
        render(<AddBookmark resolve={resolve} reject={reject} />);
        await act(async () => {});

        /* act 1 */
        const folderButton = screen.getByRole("button", {
          name: "없음",
        });
        await user.click(folderButton);

        /* assert 1 */
        await waitFor(() => {
          const optionModal = screen.getByRole("list", {
            name: "modal-option",
          });
          const folderItems = optionModal.children;
          expect(optionModal).toBeInTheDocument();
          expect(folderItems).toHaveLength(2);
        });

        /* act 2 */
        const optionModal = screen.getByRole("list", {
          name: "modal-option",
        });
        const targetButton = within(optionModal).getByRole("button", {
          name: "folder",
        });
        await user.click(targetButton);

        /* assert 2 */
        expect(targetButton).toHaveTextContent("folder");
      });
    });
  });

  describe("## 3. 컴포넌트 수준에서의 폼 입력 테스트", () => {
    /* 폼 제출 로직은 useHandleSubmit.test.ts 파일에서 수행 */

    beforeEach(() => {
      useAuthStore.getState().setAccessToken("access-token");
      const modal = document.createElement("div");
      modal.setAttribute("id", "modal");
      document.body.appendChild(modal);
    });

    afterEach(() => {
      useAuthStore.getState().clearAuth();
      const modal = document.getElementById("modal");
      if (modal?.parentNode) {
        modal?.parentNode.removeChild(modal);
      }
      server.resetHandlers();
    });

    test("### 3-1. 유효한 데이터 제출 → resolve 호출 + toast 메세지 표시", async () => {
      /* arrange */
      const user = userEvent.setup();
      render(<AddBookmark resolve={resolve} reject={reject} />);
      await act(async () => {});

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
      const saveButton = screen.getByRole("button", { name: "Save Bookmark" });

      await waitFor(async () => {
        await user.clear(urlInput);
        await user.clear(titleInput);
        await user.clear(noteTextarea);
      });

      await waitFor(async () => {
        await user.type(urlInput, EXAMPLE.URL);
        await user.type(titleInput, EXAMPLE.TITLE);
        await user.type(noteTextarea, EXAMPLE.NOTE);
      });

      await user.click(saveButton);

      /* assert */
      await waitFor(() => {
        expect(resolve).toBeCalled();
        expect(mockSuccessToast).toBeCalledWith("북마크가 추가되었습니다.");
      });
    });

    test("### 3-2. API 실패 → toast 메세지 표시", async () => {
      /* arrange */
      server.use(
        http.post(`${BASE_URL}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}`, () => {
          return HttpResponse.json(
            { ok: false, message: "API Error" },
            { status: 500 }
          );
        })
      );
      const user = userEvent.setup();
      render(<AddBookmark resolve={resolve} reject={reject} />);
      await act(async () => {});

      /* act */
      const urlInput = screen.getByRole("textbox", {
        name: BOOKMARK_FORM_ELEMENTS.URL,
      });
      const saveButton = screen.getByRole("button", { name: "Save Bookmark" });
      await user.clear(urlInput);
      await user.type(urlInput, EXAMPLE.URL);
      await user.click(saveButton);

      /* assert */
      await waitFor(() => {
        expect(resolve).toBeCalled();
        expect(mockErrorToast).toBeCalledWith(
          "북마크 추가에 실패했습니다.(500)"
        );
      });
    });
  });
});
