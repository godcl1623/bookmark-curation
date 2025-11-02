import { type MouseEvent } from "react";

import type { BasicComponentProps } from "../../../types";

interface ModalLayoutProps {
    reject?: () => void;
}

export default function ModalLayout({
    children,
    reject,
}: BasicComponentProps & ModalLayoutProps) {
    const handleClickOutside = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            reject?.();
        }
    };

    return (
        <div
            className={"absolute inset-0 bg-black/10 backdrop-blur-sm"}
            onClick={handleClickOutside}
        >
            {children}
        </div>
    );
}
