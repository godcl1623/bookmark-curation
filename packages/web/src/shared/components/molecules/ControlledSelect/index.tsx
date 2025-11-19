import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useModal } from "@/app/providers/ModalProvider/context";
import { COMMON_STYLES } from "@/features/bookmarks/AddBookmark/consts";
import Button from "@/shared/components/atoms/button";
import Option from "@/shared/components/molecules/ControlledSelect/Option";
import { cn } from "@/shared/lib/utils";

interface ControlledSelectProps {
  values: { text: string; data_id?: string | null }[];
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
          selectedValue == null || selectedValue.text === ""
            ? "justify-end"
            : "justify-between"
        )}
        value={
          selectedValue.data_id === null
            ? ""
            : (selectedValue.data_id ?? selectedValue.text)
        }
        onClick={toggleDropdown(buttonRect)}
      >
        {selectedValue.text}
        <ChevronDown />
      </Button>
    </div>
  );
}

const useSelect = (values: { text: string; data_id?: string | null }[]) => {
  const { openModal, findModal, closeModal } = useModal();
  const [selectedValue, setSelectedValue] = useState<{
    text: string;
    data_id: string | null;
  }>({
    text: values[0].text,
    data_id: values[0].data_id ?? null,
  });

  const closeOptionModal = useCallback(() => {
    const modal = findModal("Option");
    if (modal) closeModal(modal.id);
  }, [closeModal, findModal]);

  const setValue = useCallback(
    (index: number) => () => {
      setSelectedValue((prev) => ({
        ...prev,
        text: values[index].text,
        data_id: values[index].data_id ?? null,
      }));
      closeOptionModal();
    },
    [values, closeOptionModal]
  );

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

  useEffect(() => {
    if (values) {
      setValue(0);
    }
  }, [values, setValue]);

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
