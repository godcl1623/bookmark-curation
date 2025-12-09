import { useEffect, useState } from "react";

import useInput from "@/shared/hooks/useInput.ts";

const useDebouncedInput = (defaultValue: string = "") => {
  const { inputValue, changeValue, handleChange } = useInput(defaultValue);
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(inputValue), 500);
    return () => clearTimeout(timer);
  }, [inputValue]);

  return { debouncedValue, inputValue, changeValue, handleChange };
};

export default useDebouncedInput;
