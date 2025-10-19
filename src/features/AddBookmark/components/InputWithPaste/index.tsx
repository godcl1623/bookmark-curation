import { ClipboardPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { COMMON_STYLES } from "@/features/AddBookmark/consts";
import Button from "@/shared/components/atoms/button.tsx";
import ControlledInput from "@/shared/components/molecules/ControlledInput.tsx";

export default function InputWithPaste() {
  const [clipboard, pasteValue] = useClipboard();

  return (
    <>
      <ControlledInput
        key={clipboard.timestamp}
        placeholder={"https://example.com"}
        className={COMMON_STYLES.input}
        passedValue={clipboard.value}
      />
      <Button
        size={"custom"}
        variant={"ghost"}
        className={"p-1.5"}
        onClick={pasteValue}
      >
        <ClipboardPlus className={COMMON_STYLES.ornament} />
      </Button>
    </>
  );
}

const useClipboard = () => {
  const [clipboard, setClipboard] = useState({ value: "", timestamp: 0 });

  const pasteValue = async () => {
    try {
      const clipboardValue = await navigator.clipboard.readText();
      setClipboard({ value: clipboardValue, timestamp: Date.now() });
      toast.success("클립보드에서 URL을 불러왔습니다.");
    } catch (error) {
      toast.error("오류가 발생했습니다.");
      console.error("### Failed to read clipboard: ", error);
    }
  };

  return [clipboard, pasteValue] as const;
};
