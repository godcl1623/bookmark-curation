import { isAxiosError } from "axios";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { BOOKMARK_FORM_ELEMENTS } from "@/shared/consts";

export type BookmarkFormData = {
  url: string;
  title: string;
  description: string;
  parent_id: string | null;
  tag_ids: number[];
};

interface UseHandleSubmitOptions {
  onSubmit: (data: BookmarkFormData) => Promise<{ ok: boolean; data: unknown }>;
  successMessage?: string;
  errorMessage?: string;
}

const useHandleSubmit = ({
  onSubmit,
  successMessage = "성공적으로 저장되었습니다.",
  errorMessage = "저장에 실패했습니다.",
}: UseHandleSubmitOptions) => {
  const [urlErrorMessage, setUrlErrorMessage] = useState("");
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [noteErrorMessage, setNoteErrorMessage] = useState("");

  const invalidateUrl = (message: string = "유효한 URL을 입력해주세요.") => {
    setUrlErrorMessage(message);
    return false;
  };

  const invalidateTitle = (message: string) => {
    setTitleErrorMessage(message);
    return false;
  };

  const invalidateNote = (message: string) => {
    setNoteErrorMessage(message);
    return false;
  };

  const validateUrl = (url?: string) => {
    if (!url) {
      return invalidateUrl("URL은 필수 항목입니다.");
    }

    const processedUrl = url.trim().toLowerCase();
    const FORBIDDEN_SCHEMES =
      /^\s*(?:mailto:|file:|javascript:|postgresql:|jdbc:)/i;

    if (FORBIDDEN_SCHEMES.test(processedUrl)) {
      return invalidateUrl("금지된 URL 형식입니다.");
    }

    const strictRegex =
      /^https?:\/\/(?:[^\s:@\/]+@)?(?:localhost|[A-Za-z0-9.-]+\.[A-Za-z]{2,})(?::\d{1,5})?(?:[\\/?#][^\s]*)?$/i;
    const laxRegex =
      /^(?:https?:\/\/)?(?:www\.)?(?:localhost|(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,})(?::\d{1,5})?(?:[\\/?#][^\s]*)?$/i;

    let isValidUrl = false;
    let isUrlWithScheme = false;

    if (laxRegex.test(processedUrl)) isValidUrl = true;
    if (strictRegex.test(processedUrl)) isUrlWithScheme = true;
    if (!isValidUrl) {
      return invalidateUrl();
    }

    if (processedUrl.length > 2000) {
      return invalidateUrl("URL은 최대 2,000자 까지 입력할 수 있습니다.");
    }

    try {
      const testUrl = isUrlWithScheme
        ? processedUrl
        : `https://${processedUrl}`;
      const result = new URL(testUrl);

      if (!/^https?:$/.test(result.protocol) || !result.hostname) {
        return invalidateUrl();
      }

      if (result.port) {
        const port = Number(result.port);
        if (isNaN(port) || port < 0 || port > 65535) {
          return invalidateUrl();
        }
      }

      return testUrl;
    } catch (error) {
      console.error(error);
      return invalidateUrl();
    }
  };

  const validateTitle = (title?: string) => {
    if (!title || title === "") return "Untitled";
    if (title.length > 200) {
      return invalidateTitle("제목은 최대 200자 까지 입력할 수 있습니다.");
    }
    return title.trim();
  };

  const validateNote = (note?: string) => {
    if ((note?.length ?? 0) > 2000) {
      return invalidateNote("설명은 최대 2,000자 까지 입력할 수 있습니다.");
    }
    return note?.trim();
  };

  const handleSubmit =
    (successCallback?: () => void) =>
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const getNamedItem = (name: string) => {
        const target = event.currentTarget.elements.namedItem(name);
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLButtonElement ||
          target instanceof HTMLTextAreaElement
        )
          return target;
        return null;
      };

      const url = getNamedItem(BOOKMARK_FORM_ELEMENTS.URL)?.value;
      const title = getNamedItem(BOOKMARK_FORM_ELEMENTS.TITLE)?.value;
      const note = getNamedItem(BOOKMARK_FORM_ELEMENTS.NOTE)?.value;

      const validatedUrl = validateUrl(url);
      const validatedTitle = validateTitle(title);
      const validatedNote = validateNote(note);

      if (
        validatedUrl === false ||
        validatedTitle === false ||
        validatedNote === false
      )
        return;

      setUrlErrorMessage("");
      setTitleErrorMessage("");
      setNoteErrorMessage("");

      const formData: BookmarkFormData = {
        url: validatedUrl as string,
        title: validatedTitle as string,
        description: validatedNote as string,
        parent_id:
          getNamedItem(BOOKMARK_FORM_ELEMENTS.FOLDER)?.value === ""
            ? null
            : (getNamedItem(BOOKMARK_FORM_ELEMENTS.FOLDER)?.value ?? null),
        tag_ids: Array.from(event.currentTarget.querySelectorAll("li"))
          .map((li) => Number(li.getAttribute("data-id")))
          .filter((value) => value != null && !isNaN(value)),
      };

      try {
        const result = await onSubmit(formData);
        if (result.ok) {
          toast.success(successMessage);
          successCallback?.();
        }
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(`${errorMessage}(${error.status})`);
        } else if (error instanceof Error) {
          toast.error(`${errorMessage}(${error.name})`);
        }
        console.error(error);
      }
    };

  return { urlErrorMessage, titleErrorMessage, noteErrorMessage, handleSubmit };
};

export default useHandleSubmit;
