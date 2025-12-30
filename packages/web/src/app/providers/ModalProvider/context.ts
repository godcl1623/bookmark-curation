import { nanoid } from "nanoid";
import { type ComponentType, createContext, useContext } from "react";

import type { DefaultPropsType, ModalDetail, ModalStore } from "./types";

export const ModalContext = createContext<ModalStore | undefined>(undefined);

export const useModal = () => {
  const modalStoreContext = useContext(ModalContext);

  if (modalStoreContext == null) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  const { modals, setModalList } = modalStoreContext;

  const findModal = (modalInfo: { id?: string | null; name?: string }) => {
    if ("id" in modalInfo && modalInfo.id != null) {
      return modals.current.find((modal) => modal.id === modalInfo.id);
    } else {
      return modals.current.find((modal) => modal.name === modalInfo.name);
    }
  };

  const openModal = <P = DefaultPropsType, R = unknown>(
    component: ComponentType<P>,
    props?: P
  ) => {
    const name = getComponentName(component);
    const existing = findModal({ name });

    if (existing)
      return { id: existing.id, promise: existing.promise as Promise<R> };

    let res: (value: R) => void;
    let rej!: (reason?: any) => void;
    const promise = new Promise<R>((resolve, reject) => {
      res = resolve;
      rej = reject;
    });

    const modalDetail: ModalDetail<P> = {
      id: nanoid(),
      name,
      component,
      props,
      promise,
      settled: false,
      resolve: (value?: unknown) => {
        if (modalDetail.settled) return;
        modalDetail.settled = true;
        res(value as R);
        setModalList((prev) => {
          const next = prev.filter((modal) => modal.id !== modalDetail.id);
          modals.current = next;
          return next;
        });
      },
      reject: (reason?: any) => {
        if (modalDetail.settled) return;
        modalDetail.settled = true;
        rej(reason);
        setModalList((prev) => {
          const next = prev.filter((modal) => modal.id !== modalDetail.id);
          modals.current = next;
          return next;
        });
      },
    };

    setModalList((prev) => {
      const next = [...prev, modalDetail];
      modals.current = next;
      return next;
    });

    return { id: modalDetail.id, promise };
  };

  const closeModal = (id: string) => {
    setModalList((prev) => {
      const modal = prev.find((prevModal) => prevModal.id === id);
      if (modal && !modal.settled) {
        modal.settled = true;
        modal.reject?.({ cancelled: true });
      }
      const next = prev.filter((prevModal) => prevModal.id !== id);
      modals.current = next;
      return next;
    });
  };

  const resetModal = () => {
    setModalList([]);
  };

  return {
    modals,
    openModal,
    resetModal,
    findModal,
    closeModal,
  };
};

const getComponentName = <P>(component: ComponentType<P>) => {
  return component.displayName ?? component.name ?? "AnonymousComponent";
};
