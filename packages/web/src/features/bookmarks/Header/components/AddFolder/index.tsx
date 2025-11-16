import { Plus } from "lucide-react";

import Button from "@/shared/components/atoms/button";
import ControlledInput from "@/shared/components/molecules/ControlledInput";
import ControlledSelect from "@/shared/components/molecules/ControlledSelect";

export default function AddFolder() {
  return (
    <article className={"p-5"}>
      <section className={"rounded-lg bg-neutral-50 p-4"}>
        <header className={"flex-center mb-2 gap-2"}>
          <Plus className={"size-5 text-blue-500"} />
          <h2 className={"text-base"}>Add New Folder</h2>
        </header>
        <form
          className={"flex-center gap-2"}
          onSubmit={(e) => e.preventDefault()}
        >
          <ControlledInput
            placeholder={"Folder Name"}
            className={
              "flex-2 rounded-lg border border-neutral-200 bg-white px-4 py-2"
            }
          />
          <div
            className={
              "flex-[0.5] rounded-lg border border-neutral-200 bg-white p-1"
            }
          >
            {/* FIXME: 모달 시스템 이용하도록 수정 */}
            <ControlledSelect values={DUMMY_COLORS} />
          </div>
          <Button
            variant={"blank"}
            size={"lg"}
            className={"flex-[0.3] bg-blue-500 text-white"}
          >
            <Plus />
            Add
          </Button>
        </form>
      </section>
      <ul></ul>
    </article>
  );
}

const DUMMY_COLORS = ["blue", "red", "orange", "green", "purple"].map((color) =>
  color.replace(color[0], color[0].toUpperCase())
);
