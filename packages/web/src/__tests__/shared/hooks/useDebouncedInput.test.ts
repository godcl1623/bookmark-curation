import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent } from "react";

import useDebouncedInput from "@/shared/hooks/useDebouncedInput";

describe("# useDebouncedInput 테스트 ", () => {
  /* inputValue 검증은 useInput 테스트 참조 */
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("## 1. 인자 전달 테스트", () => {
    test("### 1-1. defaultValue 없이 호출 시 빈 문자열", () => {
      const { result } = renderHook(() => useDebouncedInput());
      expect(result.current.debouncedValue).toBe("");
    });

    test("### 1-2. defaultValue와 함께 호출 시 해당 값으로 초기화", async () => {
      const { result } = renderHook(() => useDebouncedInput("initial"));
      expect(result.current.inputValue).toBe("initial");
      expect(result.current.debouncedValue).toBe("");

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.debouncedValue).toBe("initial");
    });
  });

  describe("## 2. changeValue 호출 시 debouncedValue 변경", () => {
    test("### 2-1. changeValue에 값 하나만 전달", () => {
      const { result } = renderHook(() => useDebouncedInput());

      act(() => {
        result.current.changeValue("test");
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.debouncedValue).toBe("test");
    });

    test("### 2-2. changeValue를 연속으로 즉시 호출", () => {
      const { result } = renderHook(() => useDebouncedInput());

      act(() => {
        result.current.changeValue(result.current.inputValue + "t");
      });

      act(() => {
        result.current.changeValue(result.current.inputValue + "e");
      });

      act(() => {
        result.current.changeValue(result.current.inputValue + "s");
      });

      act(() => {
        result.current.changeValue(result.current.inputValue + "t");
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.debouncedValue).toBe("test");
    });

    test("### 2-3. changeValue를 연속으로 타이며 경과 전에 호출", () => {
      const { result } = renderHook(() => useDebouncedInput());

      act(() => {
        result.current.changeValue(result.current.inputValue + "t");
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.changeValue(result.current.inputValue + "e");
      });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      act(() => {
        result.current.changeValue(result.current.inputValue + "s");
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      act(() => {
        result.current.changeValue(result.current.inputValue + "t");
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.debouncedValue).toBe("test");
    });
  });

  test("## 3. handleChange 호출 시 debouncedValue 변경", () => {
    const { result } = renderHook(() => useDebouncedInput());

    const mockEvent = {
      currentTarget: { value: "typed value" },
    } as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(mockEvent);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.debouncedValue).toBe("typed value");
  });

  test("## 4. props 변경 테스트", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedInput(value),
      {
        initialProps: { value: "initial" },
      }
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.debouncedValue).toBe("initial");

    rerender({ value: "updated" });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.debouncedValue).toBe("updated");
  });

  describe("## 5. 엣지 케이스 테스트", () => {
    test("### 5-1. defaultValue가 null/undefined인 경우 업데이트하지 않음", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedInput(value),
        {
          initialProps: { value: "initial" },
        } as { initialProps: { value?: string } }
      );

      rerender({ value: undefined });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.debouncedValue).toBe("initial");
    });
  });
});
