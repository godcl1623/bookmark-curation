import type { Folder } from "@linkvault/shared";
import { describe, expect, test } from "vitest";

import { extractFoldersProperty, generateFolderOptions } from "@/shared/utils";

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
      id: 1,
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
    totalKeys.forEach((key) => {
      const folders = generateMockFolders(0);
      const result = extractFoldersProperty(folders, key as keyof Folder);
      expect(result).toHaveLength(0);
      expect(result).toSatisfy((array) =>
        array.every((item: unknown) => typeof item === "string")
      );
    });
  });

  test("##### 1-2. only one folder", () => {
    totalKeys.forEach((key) => {
      const folders = generateMockFolders(1);
      const result = extractFoldersProperty(folders, key as keyof Folder);
      expect(result).toHaveLength(1);
      expect(result).toSatisfy((array) =>
        array.every((item: unknown) => typeof item === "string")
      );
    });
  });

  test("##### 1-3. folders more than 2", () => {
    const length = getRandomInt(2, 10 ** getRandomInt(1, 5));
    totalKeys.forEach((key) => {
      const folders = generateMockFolders(length);
      const result = extractFoldersProperty(folders, key as keyof Folder);
      expect(result).toHaveLength(length);
      expect(result).toSatisfy((array) =>
        array.every((item: unknown) => typeof item === "string")
      );
    });
  });

  test("##### 1-4. handle object properties", () => {
    ["parent", "users", "_count"].forEach((key) => {
      const folders = generateMockFolders(1);
      const result = extractFoldersProperty(folders, key as keyof Folder);
      expect(result).toEqual([""]);
    });
  });

  test("##### 1-5. handle numbers to strings", () => {
    ["id", "position", "user_id"].forEach((key) => {
      const folders = generateMockFolders(1);
      const result = extractFoldersProperty(folders, key as keyof Folder);
      expect(result).toEqual(["1"]);
    });
  });
});

describe("### 2. Test generateFolderOptions", () => {
  const titleString = "title";
  const dataString = "data";
  const defaultValue: [{ text: string; data_id: string | null }] = [
    { text: "없음", data_id: null },
  ];

  const generateTestData = (str: string, length: number = 3) => {
    return Array.from({ length }, (_, index) => `${str}-${index + 1}`);
  };
  const generateCheckData = (
    textStr: string,
    data_id_str: string,
    length: number = 3
  ) => {
    return defaultValue.concat(
      Array.from({ length }, (_, index) => ({
        text: `${textStr}-${index + 1}`,
        data_id: `${data_id_str}-${index + 1}`,
      }))
    );
  };

  test("##### 2-1. no data", () => {
    const options = generateFolderOptions([], []);
    expect(options).toEqual(defaultValue);
  });

  test.each([1, 10, 100, 1000, 10000])(
    "##### 2-2. with multiple data",
    (length) => {
      const titles = generateTestData(titleString, length);
      const data_ids = generateTestData(dataString, length);
      const options = generateFolderOptions(titles, data_ids);
      expect(options).toEqual(
        generateCheckData(titleString, dataString, length)
      );
    }
  );

  test("##### 2-3. data.length > titles.length", () => {
    const titles = generateTestData(titleString, 3);
    const data_ids = generateTestData(dataString, 5);
    const options = generateFolderOptions(titles, data_ids);
    expect(options).toEqual(
      generateCheckData(titleString, dataString, titles.length)
    );
  });

  test("##### 2-4. titles.length > data.length", () => {
    const titles = generateTestData(titleString, 5);
    const data_ids = generateTestData(dataString, 3);
    const options = generateFolderOptions(titles, data_ids);
    expect(options).toEqual(
      defaultValue.concat([
        { text: "title-1", data_id: "data-1" },
        { text: "title-2", data_id: "data-2" },
        { text: "title-3", data_id: "data-3" },
        { text: "title-4", data_id: undefined },
        { text: "title-5", data_id: undefined },
      ] as any)
    );
  });
});
