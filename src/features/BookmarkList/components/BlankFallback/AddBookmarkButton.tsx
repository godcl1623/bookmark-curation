import AddBookmark from "@/features/BookmarkList/components/AddBookmark";
import Button from "@/shared/components/atoms/button.tsx";
import { useModal } from "@/shared/providers/ModalProvider/context";

export default function AddBookmarkButton() {
  const { openModal } = useModal();

  return (
    <Button
      variant={"blank"}
      className={"bg-blue-500 text-white hover:bg-blue-700"}
      onClick={() => openModal(AddBookmark)}
    >
      Add Bookmark
    </Button>
  );
}
