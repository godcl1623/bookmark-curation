import React from "react";
import ReactDOM from "react-dom";

interface AutoA11yTestOptions {
  locale?: string;
  timeout?: number;
}

export const autoA11yTest = async ({
  locale = "ko",
  timeout = 1000,
}: AutoA11yTestOptions) => {
  if (import.meta.env.NODE_ENV.includes("development")) {
    try {
      const { default: axe } = await import("@axe-core/react");
      let lang = null;
      if (locale !== "en") {
        lang = await import(`axe-core/locales/${locale}.json`);
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
