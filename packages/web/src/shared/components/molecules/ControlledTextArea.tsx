import { type ChangeEvent, type ComponentProps, useState } from "react";

interface ControlledTextAreaProps {
  updateValue?: (value: string) => void;
}

export default function ControlledTextArea({
  ...props
}: ControlledTextAreaProps &
  Omit<ComponentProps<"textarea">, "value" | "onChange">) {
  const [inputValue, changeValue] = useTextArea();

  return <textarea value={inputValue} onChange={changeValue} {...props} />;
}

const useTextArea = () => {
  const [value, setValue] = useState("");

  const changeValue = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.currentTarget.value);
  };

  return [value, changeValue] as const;
};
