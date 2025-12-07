import { useState } from "react";

const useEdit = () => {
  const [isEdit, setIsEdit] = useState(false);

  const changeEditMode = (value?: boolean) => () => {
    if (value != null) setIsEdit(value);
    setIsEdit(!isEdit);
  };

  return [isEdit, changeEditMode] as const;
};

export default useEdit;
