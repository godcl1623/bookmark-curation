import { useEffect, useMemo, useRef, useState } from "react";

import { ModalContext } from "@/shared/providers/ModalProvider/context";
import ModalComponent from "@/shared/providers/ModalProvider/ModalComponent.tsx";
import type {
  ModalDetail,
  ModalStore,
} from "@/shared/providers/ModalProvider/types.ts";
import type { BasicComponentProps } from "@/shared/types";

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
