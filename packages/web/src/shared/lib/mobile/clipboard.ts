import { Clipboard } from "@capacitor/clipboard";

import { checkIfMobileNative } from "@/shared/lib/utils";

export const readClipboard = async () => {
  if (checkIfMobileNative()) {
    const { value } = await Clipboard.read();
    return value;
  } else {
    return await navigator.clipboard.readText();
  }
};

export const writeClipboard = async (text: string) => {
  if (checkIfMobileNative()) {
    await Clipboard.write({
      string: text,
    });
  } else {
    await navigator.clipboard.writeText(text);
  }
};
