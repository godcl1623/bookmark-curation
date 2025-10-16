import Button from "@/shared/components/atoms/button.tsx";
import type { BasicComponentProps } from "@/shared/types";

export default function DirectoryTree() {
  return (
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
  );
}

function DefaultFilterButton({ children }: BasicComponentProps) {
  return (
    <Button size={"sm"} variant={"outline"} className={"text-sm font-bold"}>
      {children}
    </Button>
  );
}
