import React from "react";
import { describe, it, expect, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { useUpsertEntryMutation } from "./useUpsertEntryMutation";
import { JournalType } from "../../JournalType";

const { setAppAlert } = vi.hoisted(() => ({ setAppAlert: vi.fn() }));

vi.mock("../../../AppContext", () => ({
  useAppContext: () => ({ setAppAlert }),
}));

const rendered = vi.fn();

const MutationUser = React.memo(() => {
  useUpsertEntryMutation("journal-id", JournalType.Scraps);
  rendered();
  return <div>mutation user</div>;
});

function createTestRouter() {
  const rootRoute = createRootRoute({ component: MutationUser });

  const routeTree = rootRoute.addChildren([
    createRoute({ getParentRoute: () => rootRoute, path: "/" }),
    createRoute({ getParentRoute: () => rootRoute, path: "/search" }),
  ]);

  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
}

describe("useUpsertEntryMutation", () => {
  // There is one of these per scrap on screen, so a hook in here that follows
  // the router's state re-renders a whole journal on every navigation.
  it("does not re-render its component when navigating", async () => {
    const router = createTestRouter();

    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    await screen.findByText("mutation user");
    rendered.mockClear();

    await act(() => router.navigate({ to: "/search" }));

    expect(router.state.location.pathname).toBe("/search");
    expect(rendered).not.toHaveBeenCalled();
  });
});
