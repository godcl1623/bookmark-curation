import { Bookmark } from "lucide-react";

import AddBookmarkButton from "./AddBookmarkButton.tsx";

export default function BlankFallback() {
    return (
        <article className={"flex-col-center-center size-full gap-5"}>
            <div className={"rounded-full bg-blue-100 p-7 text-blue-500"}>
                <Bookmark className={"size-10"}/>
            </div>
            <h2>No bookmarks yet</h2>
            <p className={"text-muted-foreground"}>
                Start building your collection by adding your first bookmark
            </p>
            <AddBookmarkButton/>
        </article>
    );
}
