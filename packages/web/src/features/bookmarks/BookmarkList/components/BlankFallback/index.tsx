import { Bookmark } from "lucide-react";

import AddBookmarkButton from "./AddBookmarkButton";

export default function BlankFallback() {
  return (
    <article className={"screen-center flex-col-center-center w-full gap-5"}>
      <div className={"rounded-full bg-blue-100 p-7 text-blue-500"}>
        <Bookmark className={"size-10"} />
      </div>
      <h2>No bookmarks yet</h2>
      <p className={"px-7 text-center text-muted-foreground"}>
        Start building your collection by adding your first bookmark
      </p>
      <AddBookmarkButton />
    </article>
  );
}
