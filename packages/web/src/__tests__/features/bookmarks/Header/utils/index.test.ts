import { describe, expect, test } from "vitest";

import { findIndex } from "@/features/bookmarks/Header/utils";

describe("# 1. findIndex 테스트", () => {
  test("## 1-1. 문자열 리스트 테스트(값이 있음)", () => {
    const result = findIndex(["a", "b", "c"], "b");
    expect(result).toBe(1);
  });

  test("## 1-2. 문자열 리스트 테스트(값이 없음)", () => {
    const result = findIndex(["a", "b", "c"], "d");
    expect(result).toBe(0);
  });

  interface ExampleData {
    name: string;
    id: number;
    data: {
      age: number;
      school: string;
    };
  }
  const exampleList: ExampleData[] = [
    {
      name: "John Doe",
      id: 1,
      data: {
        age: 27,
        school: "A University",
      },
    },
    {
      name: "Jane Doe",
      id: 2,
      data: {
        age: 35,
        school: "B College",
      },
    },
  ];

  test("## 1-3. 객체 리스트 테스트(값이 있음)", () => {
    const result = findIndex(
      exampleList.map((example) => example.id),
      2
    );
    expect(result).toBe(1);
  });

  test("## 1-4. 객체 리스트 테스트(값이 없음)", () => {
    const result = findIndex(
      exampleList.map((example) => example.data.age),
      3
    );
    expect(result).toBe(0);
  });

  test("## 1-5. 빈 배열 테스트", () => {
    expect(findIndex([], null)).toBe(0);
  });

  test("## 1-6. 첫 번째 요소 찾기 (버그 체크)", () => {
    const result = findIndex(["a", "b", "c"], "a");
    expect(result).toBe(0);
  });

  test("## 1-7. 중복 값 체크 (첫 번째만 반환)", () => {
    const result = findIndex(["a", "b", "a", "c", "a"], "a");
    expect(result).toBe(0);
  });

  test("## 1-8. falsy 테스트", () => {
    expect(findIndex([0, 1, 2], 0)).toBe(0);
    expect(findIndex([false, true], false)).toBe(0);
    expect(findIndex(["", "a", "b"], "")).toBe(0);
  });
});
