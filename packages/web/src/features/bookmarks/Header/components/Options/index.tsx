import { Folder, Hash } from "lucide-react";
import { type ComponentProps, type ReactNode, useState } from "react";

import type { DefaultModalChildrenProps } from "@/app/providers/ModalProvider/types";
import AddFolder from "@/features/bookmarks/Header/components/AddFolder";
import AddTags from "@/features/bookmarks/Header/components/AddTags";
import Button from "@/shared/components/atoms/button";
import ModalLayout from "@/shared/components/layouts/modal";
import ModalTemplate from "@/shared/components/layouts/modal/ModalTemplate";
import useFolderList from "@/shared/hooks/useFolderList";
import useTagsList from "@/shared/hooks/useTagsList";
import { cn } from "@/shared/lib/utils";

export default function Options({ reject }: DefaultModalChildrenProps) {
  const { data: folders } = useFolderList();
  const { data: tags } = useTagsList();
  const [activeTab, changeTab] = useTab();

  return (
    <ModalLayout reject={reject}>
      <ModalTemplate
        reject={reject}
        modalId={"options-modal"}
        width={"w-full md:w-[40%]"}
        height={"h-[80vh] md:h-[50vh]"}
        title={"Options"}
        displayHeaderBorder={true}
      >
        <ul
          className={
            "flex-center w-full overflow-x-auto border-b border-neutral-200 px-4 pt-2 md:px-8"
          }
          role={"tablist"}
          aria-label={"설정 탭"}
        >
          {TABS_DATA.map(({ tabId, display }) => {
            return (
              <li key={`tab_${tabId}`} role={"presentation"}>
                {display({
                  tabId,
                  isActive: activeTab === tabId,
                  changeTab: changeTab(tabId),
                  count:
                    tabId === "folders"
                      ? (folders?.length ?? 0)
                      : (tags?.length ?? 0),
                })}
              </li>
            );
          })}
        </ul>
        {TABS_DATA.map(({ tabId, panel }) => (
          <div
            key={`panel_${tabId}`}
            id={`options-panel-${tabId}`}
            role={"tabpanel"}
            aria-labelledby={`options-tab-${tabId}`}
            hidden={activeTab !== tabId}
          >
            {activeTab === tabId && panel()}
          </div>
        ))}
      </ModalTemplate>
    </ModalLayout>
  );
}

type TabValue = "folders" | "tags";

interface TabDataButtonProps {
  tabId: TabValue;
  isActive?: boolean;
  changeTab?: () => void;
  count?: number;
}

const TABS_DATA = [
  {
    tabId: "folders",
    panel: () => <AddFolder />,
    display: (props: TabDataButtonProps) => (
      <TabButton icon={() => <Folder />} {...props}>
        Folders
      </TabButton>
    ),
  },
  {
    tabId: "tags",
    panel: () => <AddTags />,
    display: (props: TabDataButtonProps) => (
      <TabButton icon={() => <Hash />} {...props}>
        Tags
      </TabButton>
    ),
  },
] satisfies Array<{
  tabId: TabValue;
  panel: () => ReactNode;
  display: (props: TabDataButtonProps) => ReactNode;
}>;

const useTab = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("folders");

  const changeTab = (tab: TabValue) => () => {
    setActiveTab(tab);
  };

  return [activeTab, changeTab] as const;
};

interface TabButtonProps extends ComponentProps<"button"> {
  tabId: TabValue;
  icon?: () => ReactNode;
  isActive?: boolean;
  count?: number;
  changeTab?: () => void;
}

function TabButton({
  tabId,
  children,
  icon,
  isActive,
  count,
  changeTab,
  ...props
}: TabButtonProps) {
  const countText = String(count ? (count < 100 ? count : "99+") : 0);

  return (
    <Button
      {...props}
      type={"button"}
      id={`options-tab-${tabId}`}
      role={"tab"}
      aria-selected={isActive}
      aria-controls={`options-panel-${tabId}`}
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
