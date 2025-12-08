import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import patchBookmark from "@/shared/services/bookmarks/patch-bookmark.ts";

const handleFavorite =
  (id: string, prev: boolean, successCallback?: () => void) => async () => {
    try {
      const result = await patchBookmark(id, { is_favorite: !prev });
      if (result.ok) {
        toast.success(prev ? MESSAGES.SUCCESS.UNSET : MESSAGES.SUCCESS.SET);
        successCallback?.();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(`${MESSAGES.ERROR} (${error.status})`);
      } else if (error instanceof Error) {
        toast.error(`${MESSAGES.ERROR} (${error.name})`);
      }
      console.error(error);
    }
  };

export default handleFavorite;

const MESSAGES = {
  SUCCESS: {
    SET: "즐겨찾기에 추가했습니다.",
    UNSET: "즐겨찾기에서 제거했습니다.",
  },
  ERROR: "즐겨찾기 상태를 변경하지 못했습니다.",
};
