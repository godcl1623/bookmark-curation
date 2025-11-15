import { Folder, Hash } from "lucide-react";
import { type ReactNode, useState } from "react";

import type { DefaultModalChildrenProps } from "@/app/providers/ModalProvider/types";
import Button from "@/shared/components/atoms/button";
import ModalLayout from "@/shared/components/layouts/modal";
import ModalTemplate from "@/shared/components/layouts/modal/ModalTemplate";
import { cn } from "@/shared/lib/utils";
import type { BasicComponentProps } from "@/shared/types";

export default function Options({ reject }: DefaultModalChildrenProps) {
  const [activeTab, changeTab] = useTab();

  return (
    <ModalLayout reject={reject}>
      <ModalTemplate
        reject={reject}
        width={"w-[40%]"}
        height={"h-[50vh]"}
        title={"Options"}
        displayHeaderBorder={true}
      >
        <ul className={"flex-center border-b border-neutral-200 px-8 pt-2"}>
          {TABS_DATA.map(({ value, display }) => {
            return (
              <li key={`tab_${value}`}>
                {display({
                  isActive: activeTab === value,
                  changeTab: changeTab(value),
                })}
              </li>
            );
          })}
        </ul>
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
      <TabButton icon={() => <Folder />} {...props} count={3}>
        Folders
      </TabButton>
    ),
  },
  {
    value: "tags",
    display: (props: TabButtonProps) => (
      <TabButton icon={() => <Hash />} {...props} count={999}>
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
        "rounded-none px-4 py-2 text-base",
        isActive ? "border-b-2 border-blue-500 pb-1.5 text-blue-500" : ""
      )}
      onClick={changeTab ? changeTab : () => null}
    >
      {icon && icon()}
      {children}
      {count && (
        <span
          className={cn(
            "flex-center-center size-6 rounded-full bg-neutral-200 p-1.5 font-bold text-neutral-700",
            countText.length < 3 ? "text-xs" : "text-[10px]"
          )}
        >
          {countText}
        </span>
      )}
    </Button>
  );
}
