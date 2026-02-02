import { act, renderHook } from "@testing-library/react";

import useEdit from "@/shared/hooks/useEdit";

describe("# useEdit 테스트", () => {
  test("## 1. 기본값(false) 테스트", () => {
    const { result } = renderHook(() => useEdit());
    const [isEdit] = result.current;
    expect(isEdit).toBe(false);
  });

  describe("## 2. changeEditMode 테스트", () => {
    test("### 2-1. value를 전달하지 않는 경우", () => {
      const { result } = renderHook(() => useEdit());
      const [, setIsEdit] = result.current;

      act(() => {
        setIsEdit()();
      });

      expect(result.current[0]).toBe(true);

      act(() => {
        setIsEdit()();
      });

      expect(result.current[0]).toBe(false);
    });

    test("### 2-2. value=true를 전달한 경우", () => {
      const { result } = renderHook(() => useEdit());
      const [, setIsEdit] = result.current;

      act(() => {
        setIsEdit(true)();
      });

      expect(result.current[0]).toBe(true);
    });

    test("### 2-3. value=false를 전달한 경우", () => {
      const { result } = renderHook(() => useEdit());
      const [, setIsEdit] = result.current;

      act(() => {
        setIsEdit(false)();
      });

      expect(result.current[0]).toBe(false);
    });

    test("### 2-4. value 없이 전환한 뒤 value=true 전달", () => {
      const { result } = renderHook(() => useEdit());
      const [, setIsEdit] = result.current;

      act(() => {
        setIsEdit()();
      });

      expect(result.current[0]).toBe(true);

      act(() => {
        setIsEdit(true)();
      });

      expect(result.current[0]).toBe(true);
    });
  });
});
