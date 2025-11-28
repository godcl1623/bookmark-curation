import { ClipboardPlus } from "lucide-react";
import { type ChangeEvent, type ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { COMMON_STYLES } from "@/features/bookmarks/AddBookmark/consts";
import Button from "@/shared/components/atoms/button";

interface InputProps {
  key: number | string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface InputWithPasteProps {
  input?: (props: InputProps) => ReactNode;
}

export default function InputWithPaste({ input }: InputWithPasteProps) {
  const [clipboard, pasteValue] = useClipboard();
  const [inputValue, handleInputChange] = useHandleInput(clipboard.value);

  return (
    <>
      {input &&
        input({
          key: clipboard.timestamp,
          value: inputValue,
          onChange: handleInputChange,
        })}
      <Button
        type={"button"}
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

const useHandleInput = (defaultValue?: string) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
  };

  useEffect(() => {
    setInputValue(defaultValue ?? "");
  }, [defaultValue]);

  return [inputValue, handleInputChange] as const;
};

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
