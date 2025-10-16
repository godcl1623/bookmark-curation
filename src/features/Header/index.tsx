import {
  Bookmark,
  LayoutGrid,
  LayoutList,
  Search,
  Settings,
} from "lucide-react";

import Button from "@/shared/components/atoms/button.tsx";

export default function Header() {
  return (
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
  );
}
