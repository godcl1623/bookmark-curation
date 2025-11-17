import { Plus } from "lucide-react";
import type { FormEvent, ReactNode } from "react";

import Button from "@/shared/components/atoms/button";
import ControlledInput from "@/shared/components/molecules/ControlledInput";

interface DataAddFormProps {
  title?: string;
  inputOptions?: {
    placeholder?: string;
    name?: string;
  };
  addOns?: () => ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export default function DataAddForm({
  title,
  inputOptions = {},
  addOns,
  onSubmit,
}: DataAddFormProps) {
  return (
    <section className={"rounded-lg bg-neutral-50 p-4"}>
      <header className={"flex-center mb-2 gap-2"}>
        <Plus className={"size-5 text-blue-500"} />
        <h2 className={"text-base"}>{title}</h2>
      </header>
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
        />
        {addOns && addOns()}
        <Button
          type={"submit"}
          variant={"blank"}
          size={"lg"}
          className={"flex-[0.3] bg-blue-500 text-white"}
        >
          <Plus />
          Add
        </Button>
      </form>
    </section>
  );
}
