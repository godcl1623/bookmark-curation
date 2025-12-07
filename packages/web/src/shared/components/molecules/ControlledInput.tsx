import { type ComponentProps } from "react";

import useInput from "@/shared/hooks/useInput";

interface ControlledInputProps {
  passedValue?: string;
}

// FIXME: passedValue 대신 defaultValue 사용하도록 수정
export default function ControlledInput({
  passedValue,
  ...props
}: ControlledInputProps & Omit<ComponentProps<"input">, "value" | "onChange">) {
  const { inputValue, handleChange } = useInput(passedValue);

  return <input value={inputValue} onChange={handleChange} {...props} />;
}
