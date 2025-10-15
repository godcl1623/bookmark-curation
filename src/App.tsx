import {
  Bookmark,
  LayoutGrid,
  LayoutList,
  Search,
  Settings,
} from "lucide-react";

function App() {
  return (
    <>
      <header className={"flex items-center justify-between px-10 py-3 shadow"}>
        <div className={"flex items-center gap-2"}>
          <div className={"rounded-md bg-blue-600 p-1.5 text-white"}>
            <Bookmark />
          </div>
          <h1 className={"text-xl font-bold"}>LinkVault</h1>
        </div>
        <div className={"flex items-center gap-4"}>
          <button>
            <Search className={"size-5"} />
          </button>
          <button>
            <Settings className={"size-5"} />
          </button>
          <ul
            className={"flex items-center gap-1 rounded-md bg-neutral-200 p-1"}
          >
            <li className={"flex items-center"}>
              <button className={"rounded-sm bg-white p-1.5"}>
                <LayoutGrid className={"size-4 text-blue-600"} />
              </button>
            </li>
            <li className={"flex items-center"}>
              <button className={"rounded-sm bg-neutral-200 p-1.5"}>
                <LayoutList className={"size-4"} />
              </button>
            </li>
          </ul>
        </div>
      </header>
      <div className={"flex h-[calc(100vh-60px)]"}>
        <aside className={"flex w-[15%] flex-col gap-5 p-5"}>
          <button
            className={
              "rounded-sm border border-neutral-200 px-5 py-0.5 text-left text-sm font-bold"
            }
          >
            All
          </button>
          <button
            className={
              "rounded-sm border border-neutral-200 px-5 py-0.5 text-left text-sm font-bold"
            }
          >
            Favorites
          </button>
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
