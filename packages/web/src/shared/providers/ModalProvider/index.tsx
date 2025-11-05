import { useEffect, useMemo, useRef, useState } from "react";

import { ModalContext } from "./context.ts";
import ModalComponent from "./ModalComponent.tsx";
import type {
    ModalDetail,
    ModalStore,
} from "./types.ts";
import type { BasicComponentProps } from "../../types";

export default function ModalProvider({ children }: BasicComponentProps) {
    const [modalList, setModalList] = useState<ModalDetail[]>([]);
    const displayingModalListRef = useRef<ModalDetail[]>([]);

    const initialValue = useMemo<ModalStore>(
        () => ({
            modals: displayingModalListRef,
            setModalList,
        }),
        [setModalList],
    );

    useEffect(() => {
        displayingModalListRef.current = modalList;
    }, [modalList]);

    return (
        <ModalContext.Provider value={initialValue}>
            {modalList.map((modal) => (
                <ModalComponent key={modal.id} modal={modal}/>
            ))}
            {children}
        </ModalContext.Provider>
    );
}
