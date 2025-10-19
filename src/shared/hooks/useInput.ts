import { type ChangeEvent, useEffect, useState } from "react";

const useInput = (passedValue?: string) => {
  const [inputValue, setValue] = useState("");

  const changeValue = (value: string) => {
    setValue(value);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  useEffect(() => {
    if (passedValue != null && passedValue !== "") {
      setValue(passedValue);
    }
  }, [passedValue]);

  return { inputValue, changeValue, handleChange };
};

export default useInput;
