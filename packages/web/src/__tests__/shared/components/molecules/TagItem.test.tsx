import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import TagItem from "@/shared/components/molecules/TagItem";

describe("# TagItem 테스트", () => {
  const tagText = "Test Tag";

  test("## 1. 태그 이름을 화면에 표시", () => {
    render(<TagItem tag={tagText} />);
    const tagElement = screen.getByText(`#${tagText}`);
    expect(tagElement).toBeVisible();
  });

  describe("## 2. 조건부 렌더링(bookmarks)", () => {
    test("### 2-1. bookmarks props가 없음", () => {
      render(<TagItem tag={tagText} />);
      const tagElement = screen.getByText(`#${tagText}`);
      expect(tagElement).toBeVisible();

      const bookmarkBadge = screen.queryByText(/^\d+$/);
      expect(bookmarkBadge).not.toBeInTheDocument();
    });

    test("### 2-2. bookmarks props가 99 이하", () => {
      render(<TagItem tag={tagText} bookmarks={6} />);

      const bookmarkBadge = screen.getByText("6");
      expect(bookmarkBadge).toBeVisible();
    });

    test("### 2-3. bookmarks props가 99 초과", () => {
      render(<TagItem tag={tagText} bookmarks={106} />);

      const bookmarkBadge = screen.getByText("99+");
      expect(bookmarkBadge).toBeVisible();
    });
  });

  describe("## 3. 조건부 렌더링(needClose)", () => {
    test("### 3-1. needClose props가 없음", () => {
      render(<TagItem tag={tagText} />);

      const closeButton = screen.queryByRole("button");
      expect(closeButton).not.toBeInTheDocument();
    });

    test("### 3-2. needClose props가 false", () => {
      render(<TagItem tag={tagText} needClose={false} />);

      const closeButton = screen.queryByRole("button");
      expect(closeButton).not.toBeInTheDocument();
    });

    test("### 3-3. needClose props가 true", () => {
      render(<TagItem tag={tagText} needClose={true} />);

      const closeButton = screen.getByRole("button");
      expect(closeButton).toBeVisible();
    });
  });

  describe("## 4. 사용자 상호작용(onClick)", () => {
    test("### 4-1. onClick 전달 + 사용자가 클릭함", async () => {
      const user = userEvent.setup();
      const mockFunction = vi.fn();

      render(<TagItem tag={tagText} needClose={true} onClick={mockFunction} />);

      const closeButton = screen.getByRole("button");
      await user.click(closeButton);
      expect(mockFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe("## 5. 사이즈 테스트", () => {
    /** SIZES 일람
     * sm: px-1.5 py-0.5 text-xs
     * md: px-3 py-1 text-sm
     * lg: px-6 py-2
     */

    test("### 5-1. size props를 전달하지 않음 → 기본값 md 적용", () => {
      render(<TagItem tag={tagText} />);
      const tagElement = screen.getByText(`#${tagText}`);
      expect(tagElement).toHaveClass("px-3 py-1 text-sm");
    });

    test("### 5-2. size props로 'sm' 전달", () => {
      render(<TagItem tag={tagText} size={"sm"} />);
      const tagElement = screen.getByText(`#${tagText}`);
      expect(tagElement).toHaveClass("px-1.5 py-0.5 text-xs");
    });

    test("### 5-3. size props로 'md' 전달", () => {
      render(<TagItem tag={tagText} size={"md"} />);
      const tagElement = screen.getByText(`#${tagText}`);
      expect(tagElement).toHaveClass("px-3 py-1 text-sm");
    });

    test("### 5-4. size props로 'lg' 전달", () => {
      render(<TagItem tag={tagText} size={"lg"} />);
      const tagElement = screen.getByText(`#${tagText}`);
      expect(tagElement).toHaveClass("px-6 py-2");
    });
  });
});
