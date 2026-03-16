import { QueryClient } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";

import { server } from "@/__tests__/mock/node";
import { act, render, screen, waitFor } from "@/__tests__/mock/utils";
import AddBookmark from "@/features/bookmarks/AddBookmark";
import { BOOKMARK_FORM_ELEMENTS } from "@/shared/consts";
import useAuthStore from "@/stores/auth";

describe("# useInvalidateDirectories 테스트", () => {
  const resolve = vi.fn();
  const reject = vi.fn();
  const EXAMPLE = {
    URL: "https://www.example.com",
    TITLE: "Example Bookmark",
    NOTE: "Example Note",
  };

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

  test("## 1. invalidateDirectories 호출 확인", async () => {
    /* arrange */
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const spy = vi.spyOn(queryClient, "invalidateQueries");
    render(<AddBookmark resolve={resolve} reject={reject} />, { queryClient });
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
      expect(spy).toHaveBeenCalledWith({ queryKey: ["directories"] });
    });
  });
});
