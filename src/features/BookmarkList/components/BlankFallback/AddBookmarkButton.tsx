import Button from "@/shared/components/atoms/button.tsx";
import { useModal } from "@/shared/providers/ModalProvider/context";
import type { DefaultModalChildrenProps } from "@/shared/providers/ModalProvider/types.ts";

export default function AddBookmarkButton() {
  const { openModal } = useModal();

  return (
    <Button
      variant={"blank"}
      className={"bg-blue-500 text-white hover:bg-blue-700"}
      onClick={() => openModal(TestModal)}
    >
      Add Bookmark
    </Button>
  );
}

function TestModal({ reject }: DefaultModalChildrenProps) {
  return (
    <div className={"absolute inset-0 bg-black/10 backdrop-blur-sm"}>
      <div
        className={
          "screen-center size-[300px] rounded-lg bg-white p-5 shadow-lg"
        }
      >
        <div>Test</div>
        <Button variant={"secondary"} onClick={reject}>
          close
        </Button>
      </div>
    </div>
  );
}
