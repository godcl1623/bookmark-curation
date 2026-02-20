import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import useClickOutside from "@/shared/hooks/useClickOutside";

describe("# useClickOutside 테스트", () => {
  test("## 1. 기본 동작 테스트: 외부 클릭시 closeModal 호출", async () => {
    const user = userEvent.setup();
    const closeModal = vi.fn();
    render(<TestComponent onClose={closeModal} />);

    const outsideHeading = screen.getByRole("heading");
    await user.click(outsideHeading);

    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  test("## 2. 내부 클릭시 호출 없음", async () => {
    const user = userEvent.setup();
    const closeModal = vi.fn();
    render(<TestComponent onClose={closeModal} />);

    const insideElement = screen.getByRole("listitem");
    await user.click(insideElement);

    expect(closeModal).not.toHaveBeenCalled();

    const containerElement = screen.getByTestId("container");
    await user.click(containerElement);

    expect(closeModal).not.toHaveBeenCalled();
  });
});

function TestComponent({ onClose }: { onClose: () => void }) {
  const { containerRef } = useClickOutside(onClose);

  return (
    <div>
      <h1>외부 제목</h1>
      <ul ref={containerRef} data-testid={"container"}>
        <li>내부 요소</li>
      </ul>
    </div>
  );
}
