import { useEffect, useState } from "react";

import BlankFallback from "@/features/BookmarkList/components/BlankFallback";
import BookmarkCard from "@/features/BookmarkList/components/BookmarkCard";

export default function BookmarkList() {
  const dummyList = useRandomDummyList();

  return (
    <main className={"w-[85%] bg-blue-50/75 p-5"}>
      {dummyList.length === 0 ? (
        <BlankFallback />
      ) : (
        <div>
          <BookmarkCard />
        </div>
      )}
    </main>
  );
}

const useRandomDummyList = () => {
  const [dummyList, setDummyList] = useState<string[]>([]);

  useEffect(() => {
    const randomNumber = Math.random();

    if (randomNumber < 0.5) {
      return;
    } else {
      setDummyList((prev) => [...prev, "foo"]);
    }
  }, []);

  return dummyList;
};
