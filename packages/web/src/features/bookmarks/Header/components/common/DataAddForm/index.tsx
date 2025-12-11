import { Plus } from "lucide-react";

import FormCore from "@/features/bookmarks/Header/components/common/DataAddForm/FormCore";
import type { FormCoreProps } from "@/features/bookmarks/Header/components/common/DataAddForm/types";
import Button from "@/shared/components/atoms/button";
import useGlobalStore from "@/stores/global.ts";

interface DataAddFormProps {
  title?: string;
}

export default function DataAddForm({
  title,
  inputOptions = {},
  addOns,
  onSubmit,
}: DataAddFormProps & FormCoreProps) {
  const isMobile = useGlobalStore((state) => state.isMobile);

  return (
    <section className={"rounded-lg bg-neutral-50 p-2 md:p-4"}>
      <header className={"flex-center mb-2 gap-2"}>
        <Plus className={"size-5 text-blue-500"} />
        <h2 className={"text-base"}>{title}</h2>
      </header>
      <FormCore
        inputOptions={inputOptions}
        shouldDisplayVertical={isMobile}
        addOns={addOns}
        actions={() => (
          <Button
            type={"submit"}
            variant={"blank"}
            size={"lg"}
            className={"bg-blue-500 text-white md:flex-[0.3]"}
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
