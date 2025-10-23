import BlankFallback from "@/features/BookmarkList/components/BlankFallback";
import TagItem from "@/shared/components/molecules/TagItem.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/components/organisms/card.tsx";

export default function BookmarkList() {
  const dummyList = ["foo"];

  return (
    <main className={"w-[85%] bg-blue-50/75 p-5"}>
      {dummyList.length === 0 && <BlankFallback />}
      <div>
        <Card className={"h-[360px] w-[320px] gap-0 p-0"}>
          <div className={"h-1/2 w-full rounded-t-xl bg-neutral-100"} />
          <CardContent className={"p-3"}>
            <header className={"mb-5 py-2"}>
              <CardTitle className={"line-clamp-1 text-left"}>
                Test Title
              </CardTitle>
            </header>
            <CardDescription>Test Description</CardDescription>
            <ul className={"my-5 flex gap-2"}>
              <li>
                <TagItem tag={"foo"} size={"sm"} />
              </li>
              <li>
                <TagItem tag={"bar"} size={"sm"} />
              </li>
              <li>
                <TagItem tag={"doh"} size={"sm"} />
              </li>
            </ul>
            <div className={"border-t border-neutral-200 p-3 pb-0"}>foo</div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
