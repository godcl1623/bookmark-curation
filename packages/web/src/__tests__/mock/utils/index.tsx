import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderOptions,
} from "@testing-library/react";
import { type ReactNode, useState } from "react";

import ModalProvider from "@/app/providers/ModalProvider";

const renderWithProviders = (ui: ReactNode, options: RenderOptions = {}) =>
  render(ui, {
    wrapper: ({ children }) => <TestProvider>{children}</TestProvider>,
    ...options,
  });

const renderHookWithProviders = <Result, Props>(
  callback: (initialProps: Props) => Result,
  renderHookOptions: RenderHookOptions<Props> = {}
) =>
  renderHook(callback, {
    wrapper: ({ children }) => <TestProvider>{children}</TestProvider>,
    ...renderHookOptions,
  });

export * from "@testing-library/react";

export { renderWithProviders as render, renderHookWithProviders as renderHook };

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        gcTime: 0,
        retry: 0,
      },
    },
  });
};

function TestProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createTestQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>{children}</ModalProvider>
    </QueryClientProvider>
  );
}
