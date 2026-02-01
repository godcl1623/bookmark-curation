import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent } from "react";

import useInput from "@/shared/hooks/useInput";

describe("# 1. passedValue 전달 테스트", () => {
  test("## 1-1. passedValue 없이 호출 시 빈 문자열", () => {
    const { result } = renderHook(() => useInput());
    expect(result.current.inputValue).toBe("");
  });

  test("## 1-2. passedValue와 함께 호출시 해당 값으로 초기화", () => {
    const { result } = renderHook(() => useInput("initial value"));
    expect(result.current.inputValue).toBe("initial value");
  });
});

test("# 2. changeValue 호출 시 inputValue 변경", () => {
  const { result } = renderHook(() => useInput("initial value"));
  act(() => result.current.changeValue("changed value"));
  expect(result.current.inputValue).toBe("changed value");
});

test("# 3. handleChange 호출 시 이벤트에서 값 추출", () => {
  const { result } = renderHook(() => useInput("initial value"));
  const mockEvent = {
    currentTarget: { value: "typed value" },
  } as ChangeEvent<HTMLInputElement>;

  act(() => result.current.handleChange(mockEvent));
  expect(result.current.inputValue).toBe("typed value");
});

test("# 4. props 변경 테스트", () => {
  const { result, rerender } = renderHook(({ value }) => useInput(value), {
    initialProps: { value: "initial" },
  });

  expect(result.current.inputValue).toBe("initial");

  rerender({ value: "updated" });

  expect(result.current.inputValue).toBe("updated");
});

describe("# 5. 엣지 케이스 테스트", () => {
  test("## 5-1. passedValue가 빈 문자열이면 업데이트 안 함", () => {
    const { result, rerender } = renderHook(({ value }) => useInput(value), {
      initialProps: { value: "initial" },
    });

    rerender({ value: "" });
    expect(result.current.inputValue).toBe("initial");
  });

  test("## 5-2. passedValue가 null/undefined인 경우", () => {
    const { result, rerender } = renderHook(({ value }) => useInput(value), {
      initialProps: { value: "initial" },
    } as { initialProps: { value?: string } });

    rerender({ value: undefined });
    expect(result.current.inputValue).toBe("initial");
  });
});
