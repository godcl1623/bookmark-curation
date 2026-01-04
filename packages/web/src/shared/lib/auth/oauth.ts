import { Browser } from "@capacitor/browser";

import { checkIfMobileNative } from "@/shared/lib/utils";

export const openOAuthUrl = async (url: string) => {
  if (checkIfMobileNative()) {
    // mobile=true 파라미터 추가
    const separator = url.includes('?') ? '&' : '?';
    const mobileUrl = `${url}${separator}mobile=true`;
    await Browser.open({ url: mobileUrl });
  } else {
    window.location.href = url;
  }
};
