import { cn } from "@/shared/lib/utils";

interface SkeletonFallbackProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function Skeleton({
  width,
  height,
  className,
}: SkeletonFallbackProps) {
  const w = width
    ? typeof width === "string"
      ? width
      : `${width}px`
    : undefined;
  const h = height
    ? typeof height === "string"
      ? height
      : `${height}px`
    : undefined;

  return (
    <div
      className={cn("skeleton-shimmer rounded-lg", className)}
      style={{ width: w, height: h }}
    />
  );
}
