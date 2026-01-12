import { describe, expect, test } from "vitest";

import { cn } from "@/shared/lib/utils";

describe("# 1. cn 테스트", () => {
  test("## 1-1. input이 빈 경우", () => {
    // 1. 아예 비어있는 경우
    const result1 = cn();
    expect(result1).toBe("");

    // 2. 빈 문자열인 경우
    const result2 = cn("", "", "");
    expect(result2).toBe("");
  });

  test("## 1-2. input이 모두 문자열인 경우", () => {
    const result = cn("w-4", "h-5", "bg-red-500");
    expect(result).toBe("w-4 h-5 bg-red-500");
  });

  test("## 1-3. input에 다른 타입들이 섞여있는 경우", () => {
    const isActive = true;
    const size = "md";

    const result = cn(
      isActive && "bg-red-500",
      !isActive && "text-white",
      null,
      undefined,
      { "aspect-square": size === "md", "aspect-video": false },
      ["font-bold", "border border-black"]
    );
    expect(result).toBe(
      "bg-red-500 aspect-square font-bold border border-black"
    );
  });

  test("## 1-4. input에 중복되는 값이 포함된 경우", () => {
    const result = cn("w-4", "h-5", "bg-red-500", "w-8 bg-blue-500");
    expect(result).toBe("h-5 w-8 bg-blue-500");
  });
});
