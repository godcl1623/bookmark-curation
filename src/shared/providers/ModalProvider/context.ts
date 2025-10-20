import {
  type Attributes,
  createContext,
  type FunctionComponent,
  useContext,
} from "react";

import type {
  ModalDetail,
  ModalStore,
} from "@/shared/providers/ModalProvider/types.ts";

export const ModalContext = createContext<ModalStore | undefined>(undefined);

export const useModal = () => {
  const modalStoreContext = useContext(ModalContext);

  if (modalStoreContext == null) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  const { modals, setModalList } = modalStoreContext;

  const checkModal = (component: FunctionComponent<any>) => {
    return modals.current.some(
      (modal) => modal.component.displayName === component.displayName
    );
  };

  const openModal = (
    component: FunctionComponent<any>,
    props?: Attributes & Record<string, unknown>
  ) => {
    const isDuplicate = checkModal(component);

    if (isDuplicate) return;

    return new Promise((resolve, reject) => {
      const modalDetail: ModalDetail = {
        id: `modal-${Math.max(modals.current.length - 1, 0) + 1}`,
        component,
        props,
        resolve,
        reject,
      };

      setModalList([...modals.current, modalDetail]);
    });
  };

  const closeModal = (id: string) => {
    setModalList(modals.current.filter((modal) => modal.id !== id));
  };

  const resolveModal = (modal: ModalDetail, result?: any) => {
    modal.resolve(result);
    closeModal(modal.id);
  };

  const rejectModal = (modal: ModalDetail, reason?: unknown) => {
    modal.reject(reason ?? { cancelled: true });
    closeModal(modal.id);
  };

  const resetModal = () => {
    setModalList([]);
  };

  return {
    modals,
    openModal,
    resolveModal,
    rejectModal,
    resetModal,
  };
};
