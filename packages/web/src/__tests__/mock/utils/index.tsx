import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderOptions,
} from "@testing-library/react";
import { type ReactNode, useState } from "react";

import ModalProvider from "@/app/providers/ModalProvider";

const renderWithProviders = (
  ui: ReactNode,
  options: RenderOptions & { queryClient?: QueryClient } = {}
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <TestProvider queryClient={options.queryClient}>{children}</TestProvider>
    ),
    ...options,
  });

const renderHookWithProviders = <Result, Props>(
  callback: (initialProps: Props) => Result,
  renderHookOptions: RenderHookOptions<Props> & {
    queryClient?: QueryClient;
  } = {}
) =>
  renderHook(callback, {
    wrapper: ({ children }) => (
      <TestProvider queryClient={renderHookOptions.queryClient}>
        {children}
      </TestProvider>
    ),
    ...renderHookOptions,
  });

export * from "@testing-library/react";

export { renderWithProviders as render, renderHookWithProviders as renderHook };

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        retry: 0,
      },
    },
  });
};

function TestProvider({
  children,
  queryClient,
}: {
  children: ReactNode;
  queryClient?: QueryClient;
}) {
  const [queryClientInstance] = useState(queryClient ?? createTestQueryClient);

  return (
    <QueryClientProvider client={queryClientInstance}>
      <ModalProvider>{children}</ModalProvider>
    </QueryClientProvider>
  );
}
