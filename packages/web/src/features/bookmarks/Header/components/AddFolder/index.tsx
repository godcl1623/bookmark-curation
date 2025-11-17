import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";

import Button from "@/shared/components/atoms/button";
import ControlledInput from "@/shared/components/molecules/ControlledInput";
import ControlledSelect from "@/shared/components/molecules/ControlledSelect";
import { FOLDER_COLORS } from "@/shared/consts";

export default function AddFolder() {
  return (
    <article className={"p-5"}>
      <section className={"rounded-lg bg-neutral-50 p-4"}>
        <header className={"flex-center mb-2 gap-2"}>
          <Plus className={"size-5 text-blue-500"} />
          <h2 className={"text-base"}>Add New Folder</h2>
        </header>
        <form className={"flex-center gap-2"} onSubmit={handleSubmit}>
          <ControlledInput
            placeholder={"Folder Name"}
            name={FORM_ELEMENTS.INPUT}
            className={
              "flex-2 rounded-lg border border-neutral-200 bg-white px-4 py-2"
            }
          />
          <div
            className={
              "flex-[0.5] rounded-lg border border-neutral-200 bg-white p-1"
            }
          >
            <ControlledSelect
              values={Object.keys(FOLDER_COLORS)}
              name={FORM_ELEMENTS.SELECT}
            />
          </div>
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
      <ul></ul>
    </article>
  );
}

const FORM_ELEMENTS = {
  INPUT: "folderName",
  SELECT: "folderColor",
};

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const input = event.currentTarget.elements.namedItem(FORM_ELEMENTS.INPUT);
  const select = event.currentTarget.elements.namedItem(FORM_ELEMENTS.SELECT);

  switch (true) {
    case input instanceof HTMLInputElement &&
      select instanceof HTMLButtonElement:
      if (input.value === "") {
        toast.error("폴더 이름은 필수입니다.");
        return;
      }

      console.log(input.value);
      console.log(select.value);

      return;

    case input instanceof RadioNodeList && select instanceof RadioNodeList:
      toast.error("잘못된 요소가 로드되었습니다.");
      return;

    default:
      toast.error("폼 요소가 로드되지 않았습니다.");
      return;
  }
};
