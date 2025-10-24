import BlankFallback from "@/features/BookmarkList/components/BlankFallback";
import BookmarkCard from "@/features/BookmarkList/components/BookmarkCard";

export default function BookmarkList() {
  const dummyList = ["foo"];

  return (
    <main className={"w-[85%] bg-blue-50/75 p-5"}>
      {dummyList.length === 0 && <BlankFallback />}
      <div>
        <BookmarkCard />
      </div>
    </main>
  );
}
