import { useState } from "react";

const useEdit = () => {
  const [isEdit, setIsEdit] = useState(false);

  const changeEditMode = (value?: boolean) => () => {
    if (value != null) setIsEdit(value);
    else setIsEdit((prev) => !prev);
  };

  return [isEdit, changeEditMode] as const;
};

export default useEdit;
