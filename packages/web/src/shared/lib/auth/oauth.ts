import { Browser } from "@capacitor/browser";

import { checkIfMobileNative } from "@/shared/lib/utils";

export const openOAuthUrl = async (url: string) => {
  if (checkIfMobileNative()) {
    await Browser.open({ url });
  } else {
    window.location.href = url;
  }
};
