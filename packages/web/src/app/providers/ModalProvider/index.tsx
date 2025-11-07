import { useEffect, useMemo, useRef, useState } from "react";

import type { BasicComponentProps } from "@/shared/types";

import { ModalContext } from "./context";
import ModalComponent from "./ModalComponent";
import type { ModalDetail, ModalStore } from "./types";

export default function ModalProvider({ children }: BasicComponentProps) {
  const [modalList, setModalList] = useState<ModalDetail[]>([]);
  const displayingModalListRef = useRef<ModalDetail[]>([]);

  const initialValue = useMemo<ModalStore>(
    () => ({
      modals: displayingModalListRef,
      setModalList,
    }),
    [setModalList]
  );

  useEffect(() => {
    displayingModalListRef.current = modalList;
  }, [modalList]);

  return (
    <ModalContext.Provider value={initialValue}>
      {modalList.map((modal) => (
        <ModalComponent key={modal.id} modal={modal} />
      ))}
      {children}
    </ModalContext.Provider>
  );
}
