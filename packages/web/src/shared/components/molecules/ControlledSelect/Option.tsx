import Button from "@/shared/components/atoms/button";
import useClickOutside from "@/shared/hooks/useClickOutside";
import { cn } from "@/shared/lib/utils";

interface OptionProps {
  values: { text: string; data_id?: string | null }[];
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
        "absolute flex max-h-[208px] min-w-max flex-col gap-2 overflow-y-auto rounded-lg bg-neutral-50 p-2 text-neutral-500 shadow-xl"
      }
      style={{ top: buttonTop, left: buttonLeft, width: buttonWidth }}
      aria-label={"modal-option"}
    >
      {values.map((value, index) => (
        <li key={`option_${index}_${value}`}>
          <Button
            variant={"outline"}
            className={cn("w-full", STYLES.buttonHeight)}
            onClick={setValue(index)}
            value={value.data_id ?? value.text}
          >
            {value.text}
          </Button>
        </li>
      ))}
    </ul>
  );
}

const STYLES = {
  buttonHeight: "h-8",
};
