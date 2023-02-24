import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      useErrorBoundary: true,
      staleTime: 20_000,
    },
    mutations: {
      useErrorBoundary: true,
    },
  },
});

export const ReactQueryProviderWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
