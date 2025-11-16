import { type ComponentProps } from "react";

import useInput from "@/shared/hooks/useInput";

interface ControlledInputProps {
  passedValue?: string;
}

export default function ControlledInput({
  passedValue,
  ...props
}: ControlledInputProps & Omit<ComponentProps<"input">, "value" | "onChange">) {
  const { inputValue, handleChange } = useInput(passedValue);

  return <input value={inputValue} onChange={handleChange} {...props} />;
}
