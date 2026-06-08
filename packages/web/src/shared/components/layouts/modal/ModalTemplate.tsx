import { X } from "lucide-react";
import { type ReactNode, useId } from "react";

import Button from "@/shared/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/shared/components/organisms/card";
import { cn } from "@/shared/lib/utils";
import type { BasicComponentProps } from "@/shared/types";

interface ModalTemplateProps extends BasicComponentProps {
  modalId?: string;
  title?: string;
  width?: string;
  height?: string;
  displayHeaderBorder?: boolean;
  actionComponent?: () => ReactNode;
  reject?: () => void;
}

export default function ModalTemplate({
  reject,
  children,
  modalId,
  title = "Untitled",
  width = "w-1/2",
  height = "h-1/2",
  displayHeaderBorder = false,
  actionComponent,
}: ModalTemplateProps) {
  const fallbackId = useId();
  const id = modalId ?? `modal-${fallbackId}`;
  const headerId = `${id}-title`;

  return (
    <Card
      id={id}
      className={cn("screen-center gap-0 p-0", width, height)}
      role={"dialog"}
      aria-modal={"true"}
      aria-labelledby={headerId}
    >
      <CardHeader
        className={cn(
          "flex-center-between p-3 md:p-6",
          displayHeaderBorder && "border-b border-neutral-200"
        )}
      >
        <h1 id={headerId} className={"text-lg font-semibold"}>
          {title}
        </h1>
        <Button
          type={"button"}
          variant={"ghost"}
          size={"icon-sm"}
          onClick={reject}
          aria-label={`${title} 닫기`}
        >
          <X className={"size-5 md:size-6"} />
        </Button>
      </CardHeader>
      <CardContent
        className={cn(
          "flex-1 p-0",
          actionComponent ? "overflow-y-auto" : "overflow-y-hidden"
        )}
      >
        {children}
      </CardContent>
      {actionComponent && actionComponent()}
    </Card>
  );
}
