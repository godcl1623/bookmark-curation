import { useEffect, useRef } from "react";

import Button from "@/shared/components/atoms/button";
import { cn } from "@/shared/lib/utils";

interface OptionProps {
  values: string[];
  setValue: (index: number) => () => void;
  closeModal?: () => void;
  buttonTop?: number;
  buttonLeft?: number;
  buttonWidth?: number;
}

export default function Option({
  values,
  setValue,
  closeModal,
  buttonTop = 20,
  buttonLeft = 20,
  buttonWidth = 100,
}: OptionProps) {
  const { containerRef } = useClickOutside(closeModal ?? (() => null));

  return (
    <ul
      ref={containerRef}
      className={
        "absolute flex max-h-[208px] flex-col gap-2 overflow-y-auto rounded-lg bg-neutral-50 p-2 text-neutral-500 shadow-xl"
      }
      style={{ top: buttonTop, left: buttonLeft, width: buttonWidth }}
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

const STYLES = {
  buttonHeight: "h-8",
};

const useClickOutside = (closeModal: () => void) => {
  const containerRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const handleClickOutside = (event: MouseEvent) => {
        if (container && !container.contains(event.target as Node)) {
          closeModal();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [closeModal]);

  return { containerRef };
};
