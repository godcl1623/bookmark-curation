import type { Folder as FolderType } from "@linkvault/shared";

export const extractFoldersProperty = (
  folders: FolderType[],
  extractKey: keyof FolderType
) => {
  return folders.map((folder) => {
    const value = folder[extractKey];
    if (typeof value === "string") return value;
    else if (typeof value === "number") return String(value);
    else return "";
  });
};

export const generateFolderOptions = (
  titles: string[],
  data_ids: string[]
): { text: string; data_id: string | null }[] => {
  const defaultValue: { text: string; data_id: string | null }[] = [
    { text: "없음", data_id: null },
  ];
  return defaultValue.concat(
    titles.map((title, index) => ({
      text: title,
      data_id: data_ids[index],
    }))
  );
};
