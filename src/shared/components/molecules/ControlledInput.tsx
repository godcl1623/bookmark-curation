import {
  type ChangeEvent,
  type ComponentProps,
  useEffect,
  useState,
} from "react";

interface ControlledInputProps {
  passedValue?: string;
  updateValue?: (value: string) => void;
}

export default function ControlledInput({
  passedValue,
  updateValue,
  ...props
}: ControlledInputProps & Omit<ComponentProps<"input">, "value" | "onChange">) {
  const [inputValue, changeValue] = useInput(passedValue);

  return <input value={inputValue} onChange={changeValue} {...props} />;
}

const useInput = (passedValue?: string) => {
  const [value, setValue] = useState("");

  const changeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  useEffect(() => {
    if (passedValue != null && passedValue !== "") {
      console.log(passedValue);
      setValue(passedValue);
    }
  }, [passedValue]);

  return [value, changeValue] as const;
};
