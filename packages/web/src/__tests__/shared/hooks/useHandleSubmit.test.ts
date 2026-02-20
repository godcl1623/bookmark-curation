import { act, renderHook } from "@testing-library/react";
import type { FormEvent } from "react";

import useHandleSubmit from "@/shared/hooks/useHandleSubmit";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("# useHandleSubmit 단위 테스트", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSubmit.mockResolvedValue({ ok: true, data: {} });
  });

  describe("## 1. URL Validation 테스트", () => {
    test("### 1-1. 정상 URL 테스트(http)", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "http://example.com",
        Title: "Test Title",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(mockOnSubmit).toHaveBeenCalled();
      expect(result.current.urlErrorMessage).toBe("");
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "http://example.com",
          title: "Test Title",
          description: "Test Note",
          parent_id: null,
          tag_ids: [],
        })
      );
    });

    test("### 1-2. 정상 URL 테스트(https)", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "https://example.com",
        Title: "Test Title",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(mockOnSubmit).toHaveBeenCalled();
      expect(result.current.urlErrorMessage).toBe("");
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://example.com",
          title: "Test Title",
          description: "Test Note",
          parent_id: null,
          tag_ids: [],
        })
      );
    });

    test("### 1-3. URL에 스킴이 없는 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "example.com",
        Title: "Test Title",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(mockOnSubmit).toHaveBeenCalled();
      expect(result.current.urlErrorMessage).toBe("");
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://example.com",
          title: "Test Title",
          description: "Test Note",
          parent_id: null,
          tag_ids: [],
        })
      );
    });

    test("### 1-4. URL이 빈 문자열인 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "",
        Title: "Test Title",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.urlErrorMessage).toBe("URL은 필수 항목입니다.");
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test("### 1-5. URL에 null/undefined가 들어온 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        Title: "Test Title",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.urlErrorMessage).toBe("URL은 필수 항목입니다.");
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test("### 1-6. 금지된 스킴(mailto, file, javascript, postgresql, jdbc) 등 사용", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "mailto://example@mail.com",
        Title: "Test Title",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.urlErrorMessage).toBe("금지된 URL 형식입니다.");
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test("### 1-7. localhost인 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "http://localhost",
        Title: "Test Title",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.urlErrorMessage).toBe("");
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "http://localhost",
          title: "Test Title",
          description: "Test Note",
          parent_id: null,
          tag_ids: [],
        })
      );
    });

    test("### 1-8. URL이 2,000자를 넘는 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL:
          "http://example.com" +
          Array.from({ length: 2000 }, (_, k) => (k === 0 ? "?" : "a")).join(
            ""
          ),
        Title: "Test Title",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.urlErrorMessage).toBe(
        "URL은 최대 2,000자 까지 입력할 수 있습니다."
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test("### 1-9. 포트 번호가 존재하는 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "http://localhost:3000",
        Title: "Test Title",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.urlErrorMessage).toBe("");
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "http://localhost:3000",
          title: "Test Title",
          description: "Test Note",
          parent_id: null,
          tag_ids: [],
        })
      );
    });

    test("### 1-10. 포트 번호가 존재함 + 정상 범위를 벗어나는 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "http://localhost:77777",
        Title: "Test Title",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.urlErrorMessage).toBe("유효한 URL을 입력해주세요.");
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe("## 2. Title Validation 테스트", () => {
    test("### 2-1. 정상적인 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "http://example.com",
        Title: "Test Title",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.titleErrorMessage).toBe("");
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "http://example.com",
          title: "Test Title",
          description: "Test Note",
          parent_id: null,
          tag_ids: [],
        })
      );
    });

    test("### 2-2. 제목이 빈 문자열인 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "http://example.com",
        Title: "",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.titleErrorMessage).toBe("");
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "http://example.com",
          title: "Untitled",
          description: "Test Note",
          parent_id: null,
          tag_ids: [],
        })
      );
    });

    test("### 2-3. 제목을 작성하지 않은 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "http://example.com",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.titleErrorMessage).toBe("");
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "http://example.com",
          title: "Untitled",
          description: "Test Note",
          parent_id: null,
          tag_ids: [],
        })
      );
    });

    test("### 2-4. 제목이 200자를 넘긴 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "http://example.com",
        Title: "Test Title" + Array.from({ length: 200 }, () => "a").join(""),
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.titleErrorMessage).toBe(
        "제목은 최대 200자 까지 입력할 수 있습니다."
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test("### 2-5. 제목의 앞 뒤로 띄어쓰기가 존재하는 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "http://example.com",
        Title: "   Test Title     ",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.titleErrorMessage).toBe("");
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "http://example.com",
          title: "Test Title",
          description: "Test Note",
          parent_id: null,
          tag_ids: [],
        })
      );
    });
  });

  describe("## 3. Note Validation 테스트", () => {
    test("### 3-1. 정상적으로 설명을 입력한 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "http://example.com",
        Title: "Test Title",
        Note: "Test Note",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.noteErrorMessage).toBe("");
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "http://example.com",
          title: "Test Title",
          description: "Test Note",
          parent_id: null,
          tag_ids: [],
        })
      );
    });

    test("### 3-2. 설명 앞 뒤로 띄어쓰기가 존재하는 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "http://example.com",
        Title: "Test Title",
        Note: "  Test Note    ",
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.noteErrorMessage).toBe("");
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "http://example.com",
          title: "Test Title",
          description: "Test Note",
          parent_id: null,
          tag_ids: [],
        })
      );
    });

    test("### 3-3. 설명이 2,000자를 초과한 경우", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "http://example.com",
        Title: "Test Title",
        Note: "Test Note" + Array.from({ length: 2000 }, () => "a").join(""),
      });

      const submitHandler = result.current.handleSubmit();
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(result.current.noteErrorMessage).toBe(
        "설명은 최대 2,000자 까지 입력할 수 있습니다."
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe("## 4. handleSubmit 동작 테스트", () => {
    test("### 4-1. successCallback 호출 테스트", async () => {
      const { result } = renderHook(() =>
        useHandleSubmit({
          onSubmit: mockOnSubmit,
        })
      );

      const mockEvent = createMockFormEvent({
        URL: "http://example.com",
        Title: "Test Title",
        Note: "Test Note",
      });

      const mockSuccessCallback = vi.fn();
      const submitHandler = result.current.handleSubmit(mockSuccessCallback);
      await act(async () => {
        await submitHandler(mockEvent);
      });

      expect(mockSuccessCallback).toHaveBeenCalled();
    });
  });
});

function createMockFormEvent(values: {
  URL?: string;
  Title?: string;
  Note?: string;
  Folder?: string;
}) {
  const elements = new Map<string, HTMLInputElement | HTMLTextAreaElement>();

  const namedItem = (name: string) => {
    return elements.get(name) || null;
  };

  Object.entries(values).forEach(([key, value]) => {
    if (value != null) {
      const element =
        key === "Note"
          ? document.createElement("textarea")
          : document.createElement("input");
      element.value = value;
      elements.set(key, element as HTMLInputElement | HTMLTextAreaElement);
    }
  });

  const mockEvent = {
    preventDefault: vi.fn(),
    currentTarget: {
      elements: { namedItem },
      querySelectorAll: vi.fn().mockReturnValue([]),
    },
  } as unknown as FormEvent<HTMLFormElement>;

  return mockEvent;
}
