import type { Attributes, FunctionComponent, RefObject } from "react";

export interface ModalDetail {
  id: string;
  component: FunctionComponent<HTMLElement>;
  props?: Attributes & Record<string, unknown>;
  resolve: (param?: any) => any;
  reject: () => void;
  reset?: () => void;
}

export interface ModalStore {
  modals: RefObject<ModalDetail[]>;
  setModalList: (modalList: ModalDetail[]) => void;
}

export interface DefaultModalChildrenProps {
  resolve: (result?: any) => void;
  reject: () => void;
}
