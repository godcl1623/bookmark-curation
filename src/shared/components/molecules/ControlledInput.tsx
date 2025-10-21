import { type ComponentProps } from "react";

import useInput from "@/shared/hooks/useInput.ts";

interface ControlledInputProps {
  passedValue?: string;
  updateValue?: (value: string) => void;
}

export default function ControlledInput({
  passedValue,
  updateValue,
  ...props
}: ControlledInputProps & Omit<ComponentProps<"input">, "value" | "onChange">) {
  const { inputValue, handleChange } = useInput(passedValue);

  return <input value={inputValue} onChange={handleChange} {...props} />;
}
