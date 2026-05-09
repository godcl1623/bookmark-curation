import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderOptions,
} from "@testing-library/react";
import { type ReactNode, useState } from "react";
import { MemoryRouter, Route, Routes } from "react-router";

import ModalProvider from "@/app/providers/ModalProvider";

interface TestOptions {
  queryClient?: QueryClient;
  initialPath?: string;
}

const renderWithProviders = (
  ui: ReactNode,
  options: RenderOptions & TestOptions = {}
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <TestProvider
        queryClient={options.queryClient}
        initialPath={options.initialPath}
      >
        {children}
      </TestProvider>
    ),
    ...options,
  });

const renderHookWithProviders = <Result, Props>(
  callback: (initialProps: Props) => Result,
  renderHookOptions: RenderHookOptions<Props> & TestOptions = {}
) =>
  renderHook(callback, {
    wrapper: ({ children }) => (
      <TestProvider
        queryClient={renderHookOptions.queryClient}
        initialPath={renderHookOptions.initialPath}
      >
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
  initialPath = "/",
}: TestOptions & {
  children: ReactNode;
}) {
  const [queryClientInstance] = useState(queryClient ?? createTestQueryClient);

  return (
    <QueryClientProvider client={queryClientInstance}>
      <MemoryRouter initialEntries={["/home" + initialPath]}>
        <Routes>
          <Route
            path={"/home/*"}
            element={<ModalProvider>{children}</ModalProvider>}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}
