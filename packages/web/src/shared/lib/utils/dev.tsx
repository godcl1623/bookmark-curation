import React from "react";
import ReactDOM from "react-dom";

interface AutoA11yTestOptions {
  locale?: SupportedLocale | "en";
  timeout?: number;
}

export const autoA11yTest = async ({
  locale = "ko",
  timeout = 1000,
}: AutoA11yTestOptions = {}) => {
  if (import.meta.env.DEV) {
    try {
      const { default: axe } = await import("@axe-core/react");
      let lang = null;
      if (locale !== "en") {
        const loader = localeMap[locale];
        lang = (await loader()).default;
      }
      void axe(React, ReactDOM, timeout, lang ? { locale: lang } : {});
    } catch (error) {
      if (error instanceof Error && "message" in error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    }
  }
};

const SUPPORTED_LOCALES = ["ko"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const localeMap: Record<SupportedLocale, () => Promise<{ default: unknown }>> =
  {
    ko: () => import("axe-core/locales/ko.json"),
  };
