import type { Folder } from "@linkvault/shared";
import { describe, expect, test } from "vitest";

import { extractFoldersProperty } from "@/shared/utils";

describe("### 1. Test extractFoldersProperty", () => {
  const totalKeys = [
    "id",
    "title",
    "color",
    "parent_id",
    "position",
    "type",
    "_count",
    "users",
    "user_id",
    "created_at",
    "updated_at",
    "deleted_at",
    "data_id",
    "parent",
  ];

  const generateMockFolders = (folders: number): Folder[] => {
    return Array.from({ length: folders }, (_, k) => k).map((value) => ({
      id: value,
      title: `test-${value}`,
      color: "#000000",
      parent_id: null,
      position: 1,
      type: "folder",
      _count: {
        bookmarks: 0,
        children: 0,
      },
      users: { id: 1, display_name: "test" },
      user_id: 1,
      created_at: "2023-07-11T14:00:00.000Z",
      updated_at: "2023-07-11T14:00:00.000Z",
      deleted_at: null,
      data_id: "test",
      parent: null,
    }));
  };

  const getRandomInt = (
    min: number = 0,
    max: number = totalKeys.length - 1
  ) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  test("##### 1-1. folders are 0", () => {
    const folders = generateMockFolders(0);
    const result = extractFoldersProperty(
      folders,
      totalKeys[getRandomInt()] as keyof Folder
    );
    expect(result).toHaveLength(0);
  });

  test("##### 1-2. only one folder", () => {
    const folders = generateMockFolders(1);
    const result = extractFoldersProperty(
      folders,
      totalKeys[getRandomInt()] as keyof Folder
    );
    expect(result).toHaveLength(1);
    expect(result).toSatisfy((array) =>
      array.every((item: unknown) => typeof item === "string")
    );
  });

  test("##### 1-3. folders more than 2", () => {
    const length = getRandomInt(2, 10 ** getRandomInt(1, 5));
    console.log("length: ", length);
    const folders = generateMockFolders(length);
    const result = extractFoldersProperty(folders, "title");
    expect(result).toHaveLength(length);
    expect(result).toSatisfy((array) =>
      array.every((item: unknown) => typeof item === "string")
    );
  });
});
