import { type ChangeEvent, type ComponentProps, useState } from "react";

interface ControlledTextAreaProps {
  updateValue?: (value: string) => void;
}

export default function ControlledTextArea({
  ...props
}: ControlledTextAreaProps &
  Omit<ComponentProps<"textarea">, "value" | "onChange">) {
  const [inputValue, changeValue] = useTextArea(
    String(props.defaultValue ?? "")
  );

  return <textarea value={inputValue} onChange={changeValue} {...props} />;
}

const useTextArea = (defaultValue?: string) => {
  const [value, setValue] = useState(defaultValue ?? "");

  const changeValue = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.currentTarget.value);
  };

  return [value, changeValue] as const;
};
