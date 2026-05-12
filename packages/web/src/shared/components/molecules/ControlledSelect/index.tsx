import { ChevronDown } from "lucide-react";
import {
  type MouseEvent,
  type TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useModal } from "@/app/providers/ModalProvider/context";
import Button from "@/shared/components/atoms/button";
import Option from "@/shared/components/molecules/ControlledSelect/Option";
import { COMMON_STYLES } from "@/shared/consts";
import { cn } from "@/shared/lib/utils";

interface ValueType {
  text: string;
  data_id?: string | null;
}

interface ControlledSelectProps {
  values: ValueType[];
  initialIndex?: number;
  name?: string;
}

interface ButtonRect {
  top?: number;
  left?: number;
  bottom?: number;
  width?: number;
}

export default function ControlledSelect({
  values,
  initialIndex = 0,
  name,
}: ControlledSelectProps) {
  const { toggleDropdown, selectedValue } = useSelect(values, initialIndex);
  const { buttonRef } = useButtonRect();

  const handleToggle = (
    event: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    // TODO: 고정값이 아니라 요소 값을 참조하도록 수정
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    const adjustedRect = { ...copyDOMRect(buttonRect) };
    const viewportBottom = window.scrollY + window.innerHeight;
    if (buttonRect && buttonRect.bottom + 208 > viewportBottom) {
      adjustedRect.top = buttonRect.top - 218;
    }
    toggleDropdown(adjustedRect)();
  };

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
        onClick={handleToggle}
        onTouchStart={handleToggle}
      >
        {selectedValue.text}
        <ChevronDown />
      </Button>
    </div>
  );
}

const copyDOMRect = (
  originalRect: DOMRect | undefined
): ButtonRect | undefined => {
  if (!originalRect) return;

  return {
    top: originalRect?.top ?? 0,
    left: originalRect?.left ?? 0,
    bottom: originalRect?.bottom ?? 0,
    width: originalRect?.width ?? 0,
  };
};

const useSelect = (values: ValueType[], initialIndex: number) => {
  const { openModal, findModal, closeModal } = useModal();
  const [selectedValue, setSelectedValue] = useState<{
    text: string;
    data_id: string | null;
  }>({
    text: values[initialIndex]?.text,
    data_id: values[initialIndex]?.data_id ?? null,
  });
  const optionIdRef = useRef<string | null>(null);

  const closeOptionModal = useCallback(() => {
    const modal = findModal({ id: optionIdRef.current });
    if (modal) {
      closeModal(modal.id);
      optionIdRef.current = null;
    }
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

  const toggleDropdown = (buttonRect?: ButtonRect | null) => async () => {
    try {
      const detail = findModal({ id: optionIdRef.current });
      if (detail == null) {
        const { id } = openModal(Option, {
          values,
          setValue,
          closeModal: closeOptionModal,
          buttonTop: buttonRect?.top,
          buttonLeft: buttonRect?.left,
          buttonWidth: buttonRect?.width,
        });
        optionIdRef.current = id;
      } else {
        closeOptionModal();
      }
    } catch (error) {
      console.error("### Error in toggleDropdown: ", error);
    }
  };

  useEffect(() => {
    if (values) {
      setValue(initialIndex);
    }
  }, [values, setValue, initialIndex]);

  return { toggleDropdown, selectedValue, setValue };
};

const useButtonRect = () => {
  // const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // useEffect(() => {
  //   if (buttonRef.current) {
  //     setButtonRect(buttonRef.current.getBoundingClientRect());
  //   }
  // }, []);

  // return { buttonRect, buttonRef };
  return { buttonRef };
};
