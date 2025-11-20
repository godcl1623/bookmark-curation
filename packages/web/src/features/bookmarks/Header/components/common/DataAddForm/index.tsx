import { Plus } from "lucide-react";

import FormCore from "@/features/bookmarks/Header/components/common/DataAddForm/FormCore";
import type { FormCoreProps } from "@/features/bookmarks/Header/components/common/DataAddForm/types";
import Button from "@/shared/components/atoms/button";

interface DataAddFormProps {
  title?: string;
}

export default function DataAddForm({
  title,
  inputOptions = {},
  addOns,
  onSubmit,
}: DataAddFormProps & FormCoreProps) {
  return (
    <section className={"rounded-lg bg-neutral-50 p-4"}>
      <header className={"flex-center mb-2 gap-2"}>
        <Plus className={"size-5 text-blue-500"} />
        <h2 className={"text-base"}>{title}</h2>
      </header>
      <FormCore
        inputOptions={inputOptions}
        addOns={addOns}
        actions={() => (
          <Button
            type={"submit"}
            variant={"blank"}
            size={"lg"}
            className={"flex-[0.3] bg-blue-500 text-white"}
          >
            <Plus />
            Add
          </Button>
        )}
        onSubmit={onSubmit}
      />
    </section>
  );
}
