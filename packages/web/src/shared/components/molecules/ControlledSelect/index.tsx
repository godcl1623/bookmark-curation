import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useModal } from "@/app/providers/ModalProvider/context";
import { COMMON_STYLES } from "@/features/bookmarks/AddBookmark/consts";
import Button from "@/shared/components/atoms/button";
import Option from "@/shared/components/molecules/ControlledSelect/Option";
import { cn } from "@/shared/lib/utils";

interface ControlledSelectProps {
  values: string[];
  name?: string;
}

export default function ControlledSelect({
  values,
  name,
}: ControlledSelectProps) {
  const { toggleDropdown, selectedValue } = useSelect(values);
  const { buttonRect, buttonRef } = useButtonRect();

  return (
    <div className={"relative flex flex-1"}>
      <Button
        type={"button"}
        variant={"ghost"}
        name={name}
        ref={buttonRef}
        className={cn(
          COMMON_STYLES.input,
          "flex-center",
          selectedValue === "" ? "justify-end" : "justify-between"
        )}
        value={selectedValue}
        onClick={toggleDropdown(buttonRect)}
      >
        {selectedValue}
        <ChevronDown />
      </Button>
    </div>
  );
}

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

  const toggleDropdown = (buttonRect?: DOMRect | null) => async () => {
    try {
      const detail = findModal("Option");
      if (!detail) {
        openModal(Option, {
          values,
          setValue,
          closeModal: closeOptionModal,
          buttonTop: buttonRect?.top,
          buttonLeft: buttonRect?.left,
          buttonWidth: buttonRect?.width,
        });
      } else {
        closeOptionModal();
      }
    } catch (error) {
      console.error("### Error in toggleDropdown: ", error);
    }
  };

  return { toggleDropdown, selectedValue, setValue };
};

const useButtonRect = () => {
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
  }, []);

  return { buttonRect, buttonRef };
};
