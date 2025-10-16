import {
  Bookmark,
  LayoutGrid,
  LayoutList,
  Search,
  Settings,
} from "lucide-react";

import Button from "@/shared/components/atoms/button.tsx";
import type { BasicComponentProps } from "@/shared/types";

function App() {
  return (
    <>
      <header className={"flex-center-between px-10 py-3 shadow"}>
        <div className={"flex-center gap-2"}>
          <div className={"rounded-md bg-blue-600 p-1.5 text-white"}>
            <Bookmark />
          </div>
          <h1 className={"text-xl font-bold"}>LinkVault</h1>
        </div>
        <div className={"flex-center gap-2"}>
          <Button size={"icon-sm"} variant={"ghost"}>
            <Search className={"size-5"} />
          </Button>
          <Button size={"icon-sm"} variant={"ghost"}>
            <Settings className={"size-5"} />
          </Button>
          <ul className={"flex-center gap-1 rounded-md bg-neutral-200 p-1"}>
            <li className={"flex-center"}>
              <Button size={"icon-sm"} variant={"outline"}>
                <LayoutGrid className={"size-4 text-blue-600"} />
              </Button>
            </li>
            <li className={"flex-center"}>
              <Button size={"icon-sm"} variant={"ghost"}>
                <LayoutList className={"size-4"} />
              </Button>
            </li>
          </ul>
        </div>
      </header>
      <div className={"flex h-[calc(100vh-60px)]"}>
        <aside className={"flex w-[15%] flex-col gap-5 bg-slate-200/75 p-5"}>
          <DefaultFilterButton>All</DefaultFilterButton>
          <DefaultFilterButton>Favorites</DefaultFilterButton>
          <nav>
            <ul className={"flex flex-col gap-2"}>
              <li>
                <button className={"px-2 text-sm"}>Folder 1</button>
              </li>
              <li>
                <button className={"px-2 text-sm"}>Folder 2</button>
              </li>
              <li>
                <button className={"px-2 text-sm"}>Folder 3</button>
              </li>
            </ul>
          </nav>
        </aside>
        <main className={"w-[85%] bg-blue-50/75 p-5"}>No bookmarks yet.</main>
      </div>
    </>
  );
}

export default App;

function DefaultFilterButton({ children }: BasicComponentProps) {
  return (
    <Button size={"sm"} variant={"outline"} className={"text-sm font-bold"}>
      {children}
    </Button>
  );
}
