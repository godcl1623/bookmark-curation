import { type ChangeEvent, type ComponentProps, useState } from "react";

interface ControlledInputProps {
  updateValue?: (value: string) => void;
}

export default function ControlledInput({
  updateValue,
  ...props
}: ControlledInputProps & Omit<ComponentProps<"input">, "value" | "onChange">) {
  const [inputValue, changeValue] = useInput();

  return <input value={inputValue} onChange={changeValue} {...props} />;
}

const useInput = () => {
  const [value, setValue] = useState("");

  const changeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  return [value, changeValue] as const;
};
