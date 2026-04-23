import { Capacitor } from "@capacitor/core";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkIfMobileNative = () => Capacitor.isNativePlatform();
