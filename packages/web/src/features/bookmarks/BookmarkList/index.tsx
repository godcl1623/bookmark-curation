import { ChevronRight, LayoutGrid, LayoutList } from "lucide-react";
import { NavLink, useLocation } from "react-router";

import ExplorerView from "@/features/bookmarks/BookmarkList/components/ExplorerView";
import OptionButton from "@/shared/components/molecules/OptionButton.tsx";
import Skeleton from "@/shared/components/molecules/Skeleton";
import { COMMON_STYLES } from "@/shared/consts";
import useDirectoriesData from "@/shared/hooks/useDirectoriesData";
import { cn } from "@/shared/lib/utils";
import useGlobalStore from "@/stores/global";

export default function BookmarkList() {
  const currentView = useGlobalStore((state) => state.currentView);
  const isMobile = useGlobalStore((state) => state.isMobile);
  const setCurrentView = useGlobalStore((state) => state.setCurrentView);
  const { pathname } = useLocation();
  const loadedDirectory = useDirectoriesData(pathname ?? "/");

  const { breadcrumbs } = loadedDirectory?.data ?? {};
  const smallIconStyle = isMobile ? STYLES.iconSm : STYLES.iconMd;

  const toggleView = (view: "card" | "list") => () => setCurrentView(view);

  return (
    <main
      className={
        "relative w-full rounded-2xl bg-blue-50/75 md:h-[calc(100vh-64px)] md:w-[85%]"
      }
    >
      {/* FIXME: 긴 폴더명 처리방법 생각 */}
      <aside
        className={
          "flex-center-between w-full rounded-t-2xl border-b bg-neutral-50 p-2.5 md:p-5"
        }
      >
        <nav className={"px-2.5 md:px-5"}>
          <ul
            className={
              "flex-center line-clamp-1 gap-1 text-xs font-bold md:gap-2 md:text-base"
            }
          >
            <li className={"flex-center gap-1 md:gap-2"}>
              <NavLink to={"/"} className={"hover:underline"}>
                홈
              </NavLink>
              {pathname !== "/" && <BreadcrumbChevron />}
            </li>
            {breadcrumbs?.map((breadcrumb, index, selfArray) => (
              <li
                key={`breadcrumb_${breadcrumb.data_id}`}
                className={"flex-center gap-1 md:gap-2"}
              >
                <NavLink
                  to={
                    "/" +
                    selfArray
                      .slice(0, index + 1)
                      .map((item) => item.title)
                      .join("/")
                  }
                  className={`hover:underline`}
                >
                  {breadcrumb.title}
                </NavLink>
                {index < selfArray.length - 1 && <BreadcrumbChevron />}
              </li>
            ))}
          </ul>
        </nav>
        <ul
          className={
            "flex-center ml-auto w-max gap-0.5 rounded-md bg-neutral-200 p-0.5 md:gap-1 md:p-1"
          }
        >
          <li className={"flex-center"}>
            <OptionButton
              isActive={currentView === "card"}
              onClick={toggleView("card")}
            >
              <LayoutGrid className={smallIconStyle} />
            </OptionButton>
          </li>
          <li className={"flex-center"}>
            <OptionButton
              isActive={currentView === "list"}
              onClick={toggleView("list")}
            >
              <LayoutList className={smallIconStyle} />
            </OptionButton>
          </li>
        </ul>
      </aside>
      {loadedDirectory?.isLoading ? <Skeletons /> : <ExplorerView />}
    </main>
  );
}

const STYLES = {
  iconMd: "size-5",
  iconSm: "size-4",
  container: "p-2.5 md:p-5",
};

function BreadcrumbChevron() {
  const isMobile = useGlobalStore((state) => state.isMobile);

  return <ChevronRight className={isMobile ? "size-3" : ""} />;
}

function Skeletons() {
  return (
    <div className={cn(STYLES.container)}>
      <div className={"flex-center flex-wrap gap-4"}>
        <Skeleton height={50} width={140} />
        <Skeleton height={50} width={140} />
      </div>
      <div className={"mt-10"}>
        <Skeleton className={COMMON_STYLES.card} />
      </div>
    </div>
  );
}
