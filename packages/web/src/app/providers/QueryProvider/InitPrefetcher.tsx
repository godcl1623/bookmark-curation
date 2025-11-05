import { useEffect } from "react";

import getFoldersList from "../../../shared/services/folders/get-folders-list.ts";
import type { BasicComponentProps } from "../../../shared/types";

export default function InitPrefetcher({ children }: BasicComponentProps) {
  useEffect(() => {
    getFoldersList().then((res) => console.log(res));
  }, []);
  return children;
}
