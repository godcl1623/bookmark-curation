import { type Attributes, createElement, type FunctionComponent } from "react";
import { createPortal } from "react-dom";

import { useModal } from "./context";
import type { DefaultModalChildrenProps, ModalDetail } from "./types";

interface ModalComponentProps {
  modal: ModalDetail;
}

export default function ModalComponent({ modal }: ModalComponentProps) {
  const { resolveModal, rejectModal } = useModal();

  const resolve = (result?: unknown) => {
    resolveModal(modal, result);
  };

  const reject = (reason?: unknown) => {
    rejectModal(modal, reason);
  };

  return (
    <ModalWrapper
      componentType={modal.component}
      props={{ ...modal.props, resolve, reject }}
    />
  );
}

interface ModalWrapperProps {
  componentType?: FunctionComponent<any>;
  props?: Attributes & DefaultModalChildrenProps;
}

function ModalWrapper({ componentType, props }: ModalWrapperProps) {
  const modalElement = document.getElementById("modal");

  if (componentType == null || modalElement == null) return null;

  const componentElement = createElement(componentType, props);

  return createPortal(componentElement, modalElement);
}
