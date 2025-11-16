import type { ComponentType, RefObject } from "react";

export type DefaultPropsType = Record<string, unknown>;

export interface ModalDetail<P = any, R = unknown> {
  id: string;
  name: string;
  component: ComponentType<P>;
  props?: P;
  resolve: (value?: R) => void;
  reject: (reason?: any) => void;
  reset?: () => void;
  promise?: Promise<R>;
  settled?: boolean;
}

export interface ModalStore {
  modals: RefObject<ModalDetail[]>;
  setModalList: (
    modalList: ModalDetail[] | ((prev: ModalDetail[]) => ModalDetail[])
  ) => void;
}

export interface DefaultModalChildrenProps {
  resolve: (result?: unknown) => void;
  reject: (reason?: unknown) => void;
}
