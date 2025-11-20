import type { FormCoreProps } from "@/features/bookmarks/Header/components/common/DataAddForm/types";
import ControlledInput from "@/shared/components/molecules/ControlledInput";

export default function FormCore({
  inputOptions = {},
  addOns,
  actions,
  onSubmit,
}: FormCoreProps) {
  return (
    <form
      className={"flex-center gap-2"}
      onSubmit={onSubmit ? onSubmit : () => null}
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
