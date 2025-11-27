import { type Attributes, type ComponentType, createElement } from "react";
import { createPortal } from "react-dom";

import type { DefaultModalChildrenProps, ModalDetail } from "./types";

interface ModalComponentProps {
  modal: ModalDetail;
}

export default function ModalComponent({ modal }: ModalComponentProps) {
  const resolve = (result?: unknown) => {
    modal.resolve(result);
  };

  const reject = (reason?: unknown) => {
    modal.reject(reason);
  };

  return (
    <ModalWrapper
      componentType={modal.component}
      props={{ ...modal.props, resolve, reject }}
    />
  );
}

interface ModalWrapperProps {
  componentType?: ComponentType<any>;
  props?: Attributes & DefaultModalChildrenProps;
}

function ModalWrapper({ componentType, props }: ModalWrapperProps) {
  const modalElement = document.getElementById("modal");

  if (componentType == null || modalElement == null) return null;

  const componentElement = createElement(componentType, props);

  return createPortal(componentElement, modalElement);
}
