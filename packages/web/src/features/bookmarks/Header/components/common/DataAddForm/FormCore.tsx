import type { FormCoreProps } from "@/features/bookmarks/Header/components/common/DataAddForm/types";
import ControlledInput from "@/shared/components/molecules/ControlledInput";
import { cn } from "@/shared/lib/utils";

export default function FormCore({
  inputOptions = {},
  addOns,
  actions,
  shouldDisplayVertical = false,
  onSubmit,
  onReset,
}: FormCoreProps) {
  return (
    <form
      className={cn(
        "flex flex-1 gap-2",
        shouldDisplayVertical ? "flex-col" : "items-center"
      )}
      onSubmit={onSubmit ? onSubmit : () => null}
      onReset={onReset ? onReset : () => null}
    >
      <ControlledInput
        placeholder={inputOptions?.placeholder}
        name={inputOptions?.name}
        className={
          "flex-2 rounded-lg border border-neutral-200 bg-white px-4 py-2"
        }
        passedValue={inputOptions?.initialValue ?? ""}
      />
      {addOns && addOns()}
      {actions && actions()}
    </form>
  );
}
