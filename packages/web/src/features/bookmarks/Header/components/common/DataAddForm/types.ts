import type { FormEvent, ReactNode } from "react";

export interface FormCoreProps {
  inputOptions?: {
    placeholder?: string;
    name?: string;
    initialValue?: string;
  };
  addOns?: () => ReactNode;
  actions?: () => ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onReset?: () => void;
}
