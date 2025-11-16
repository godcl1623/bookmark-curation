import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { useModal } from "@/app/providers/ModalProvider/context";
import { COMMON_STYLES } from "@/features/bookmarks/AddBookmark/consts";
import Button from "@/shared/components/atoms/button";
import { cn } from "@/shared/lib/utils";

interface ControlledSelectProps {
  values: string[];
}

export default function ControlledSelect({ values }: ControlledSelectProps) {
  const { toggleDropdown, selectedValue } = useSelect(values);

  return (
    <div className={"relative flex flex-1"}>
      <Button
        variant={"ghost"}
        className={cn(
          COMMON_STYLES.input,
          "flex-center",
          selectedValue === "" ? "justify-end" : "justify-between"
        )}
        onClick={toggleDropdown}
      >
        {selectedValue}
        <ChevronDown />
      </Button>
    </div>
  );
}

const STYLES = {
  buttonHeight: "h-8",
};

const useSelect = (values: string[]) => {
  const { openModal, findModal, closeModal } = useModal();
  const [selectedValue, setSelectedValue] = useState(values[0]);

  const closeOptionModal = () => {
    const modal = findModal("Option");
    if (modal) closeModal(modal.id);
  };

  const setValue = (index: number) => () => {
    setSelectedValue(values[index]);
    closeOptionModal();
  };

  const toggleDropdown = async () => {
    try {
      const detail = findModal("Option");
      if (!detail) {
        openModal(Option, { values, setValue });
      } else {
        closeOptionModal();
      }
    } catch (error) {
      console.error("### Error in toggleDropdown: ", error);
    }
  };

  return { toggleDropdown, selectedValue, setValue };
};

interface OptionProps {
  values: string[];
  setValue: (index: number) => () => void;
}

function Option({ values, setValue }: OptionProps) {
  return (
    <ul
      className={
        "absolute top-0 left-5 z-[999] flex max-h-[208px] w-full flex-col gap-2 overflow-y-auto rounded-lg bg-neutral-50 p-2 text-neutral-500 shadow-xl"
      }
    >
      {values.map((value, index) => (
        <li key={`option_${index}_${value}`}>
          <Button
            variant={"outline"}
            className={cn("w-full", STYLES.buttonHeight)}
            onClick={setValue(index)}
          >
            {value}
          </Button>
        </li>
      ))}
    </ul>
  );
}
