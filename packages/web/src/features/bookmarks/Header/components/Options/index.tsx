import { Folder, Hash } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

import type { DefaultModalChildrenProps } from "@/app/providers/ModalProvider/types";
import AddFolder from "@/features/bookmarks/Header/components/AddFolder";
import AddTags from "@/features/bookmarks/Header/components/AddTags";
import Button from "@/shared/components/atoms/button";
import ModalLayout from "@/shared/components/layouts/modal";
import ModalTemplate from "@/shared/components/layouts/modal/ModalTemplate";
import useFolderList from "@/shared/hooks/useFolderList";
import useTagsList from "@/shared/hooks/useTagsList";
import { cn } from "@/shared/lib/utils";
import type { BasicComponentProps } from "@/shared/types";

export default function Options({ reject }: DefaultModalChildrenProps) {
  const { data: folders } = useFolderList();
  const { data: tags } = useTagsList();
  const [activeTab, changeTab] = useTab();

  const tabView = useMemo(() => {
    if (activeTab === "folders") return <AddFolder />;
    if (activeTab === "tags") return <AddTags />;
  }, [activeTab]);

  return (
    <ModalLayout reject={reject}>
      <ModalTemplate
        reject={reject}
        width={"w-full md:w-[40%]"}
        height={"h-[80vh] md:h-[50vh]"}
        title={"Options"}
        displayHeaderBorder={true}
      >
        <ul
          className={
            "flex-center w-full overflow-x-auto border-b border-neutral-200 px-4 pt-2 md:px-8"
          }
        >
          {TABS_DATA.map(({ value, display }) => {
            return (
              <li key={`tab_${value}`}>
                {display({
                  isActive: activeTab === value,
                  changeTab: changeTab(value),
                  count:
                    value === "folders"
                      ? (folders?.length ?? 0)
                      : (tags?.length ?? 0),
                })}
              </li>
            );
          })}
        </ul>
        {tabView}
      </ModalTemplate>
    </ModalLayout>
  );
}

interface TabButtonProps {
  isActive?: boolean;
  changeTab?: () => void;
}

const TABS_DATA = [
  {
    value: "folders",
    display: (props: TabButtonProps) => (
      <TabButton icon={() => <Folder />} {...props}>
        Folders
      </TabButton>
    ),
  },
  {
    value: "tags",
    display: (props: TabButtonProps) => (
      <TabButton icon={() => <Hash />} {...props}>
        Tags
      </TabButton>
    ),
  },
];

type TabValue = (typeof TABS_DATA)[number]["value"];

const useTab = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("folders");

  const changeTab = (tab: TabValue) => () => {
    setActiveTab(tab);
  };

  return [activeTab, changeTab] as const;
};

interface TabButtonProps extends BasicComponentProps {
  icon?: () => ReactNode;
  isActive?: boolean;
  count?: number;
  changeTab?: () => void;
}

function TabButton({
  children,
  icon,
  isActive,
  count,
  changeTab,
}: TabButtonProps) {
  const countText = String(count ? (count < 100 ? count : "99+") : 0);

  return (
    <Button
      variant={"ghost"}
      size={"custom"}
      className={cn(
        "rounded-none px-2 py-1 text-sm md:px-4 md:py-2 md:text-base",
        isActive ? "border-b-2 border-blue-500 pb-1.5 text-blue-500" : ""
      )}
      onClick={changeTab ? changeTab : () => null}
    >
      {icon && icon()}
      {children}
      <span
        className={cn(
          "flex-center-center size-5 rounded-full bg-neutral-200 p-1.5 font-bold text-neutral-700 md:size-6",
          countText.length < 3 ? "text-xs" : "text-[10px]"
        )}
      >
        {countText}
      </span>
    </Button>
  );
}
