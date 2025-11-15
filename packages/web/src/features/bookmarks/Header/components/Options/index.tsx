import type { DefaultModalChildrenProps } from "@/app/providers/ModalProvider/types";
import ModalLayout from "@/shared/components/layouts/modal";
import ModalTemplate from "@/shared/components/layouts/modal/ModalTemplate";

export default function Options({ reject }: DefaultModalChildrenProps) {
  return (
    <ModalLayout reject={reject}>
      <ModalTemplate
        reject={reject}
        width={"w-[40%]"}
        height={"h-[50vh]"}
        title={"Options"}
        displayHeaderBorder={true}
      ></ModalTemplate>
    </ModalLayout>
  );
}
