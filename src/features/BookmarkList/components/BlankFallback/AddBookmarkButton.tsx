import AddBookmark from "@/features/AddBookmark";
import Button from "@/shared/components/atoms/button.tsx";
import { useModal } from "@/shared/providers/ModalProvider/context";

export default function AddBookmarkButton() {
  const { openModal } = useModal();

  const handleClick = async () => {
    try {
      await openModal(AddBookmark);
    } catch (error) {
      return error;
    }
  };

  return (
    <Button
      variant={"blank"}
      className={"bg-blue-500 text-white hover:bg-blue-700"}
      onClick={handleClick}
    >
      Add Bookmark
    </Button>
  );
}
