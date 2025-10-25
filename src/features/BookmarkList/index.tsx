import { useEffect } from "react";

import BlankFallback from "@/features/BookmarkList/components/BlankFallback";
import BookmarkCard from "@/features/BookmarkList/components/BookmarkCard";
import BookmarkDetail from "@/features/BookmarkList/components/BookmarkDetail";
import { useModal } from "@/shared/providers/ModalProvider/context.ts";

export default function BookmarkList() {
  const { openModal } = useModal();
  const dummyList = ["foo"];

  useEffect(() => {
    openModal(BookmarkDetail, {});
  }, [openModal]);

  return (
    <main className={"w-[85%] bg-blue-50/75 p-5"}>
      {dummyList.length === 0 && <BlankFallback />}
      <div>
        <BookmarkCard />
      </div>
    </main>
  );
}
