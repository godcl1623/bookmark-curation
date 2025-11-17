import { X } from "lucide-react";
import type { ReactNode } from "react";

import Button from "@/shared/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/shared/components/organisms/card";
import { cn } from "@/shared/lib/utils";
import type { BasicComponentProps } from "@/shared/types";

interface ModalTemplateProps extends BasicComponentProps {
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
  title = "Untitled",
  width = "w-1/2",
  height = "h-1/2",
  displayHeaderBorder = false,
  actionComponent,
}: ModalTemplateProps) {
  return (
    <Card className={cn("screen-center gap-0 p-0", width, height)}>
      <CardHeader
        className={cn(
          "flex-center-between p-6",
          displayHeaderBorder && "border-b border-neutral-200"
        )}
      >
        <h1 className={"text-lg font-semibold"}>{title}</h1>
        <Button variant={"ghost"} size={"icon-sm"} onClick={reject}>
          <X className={"size-6"} />
        </Button>
      </CardHeader>
      <CardContent className={"overflow-y-hidden p-0"}>{children}</CardContent>
      {actionComponent && actionComponent()}
    </Card>
  );
}
