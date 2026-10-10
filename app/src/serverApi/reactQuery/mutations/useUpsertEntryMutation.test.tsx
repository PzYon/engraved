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
import { ServerApi } from "../../ServerApi";
import { queryKeysFactory } from "../queryKeysFactory";
import { IEntry } from "../../IEntry";

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

function createTestRouter(component: React.FC) {
  const rootRoute = createRootRoute({ component });

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
    const router = createTestRouter(MutationUser);

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

  // Entries are cached per filter, and the list on screen is the one of the
  // journal's date filter. An edit has to show up there without waiting for
  // the entries to be loaded again.
  it("puts an edited entry into every cached list of its journal", async () => {
    const queryClient = new QueryClient();

    const entry = { id: "entry-id", notes: "before" } as IEntry;
    const otherEntry = { id: "other-entry-id", notes: "untouched" } as IEntry;

    const thisMonth = queryKeysFactory.journalEntries(
      "journal-id",
      { from: new Date(2026, 9, 1), to: new Date(2026, 9, 31) },
      {},
      "",
    );
    const unfiltered = queryKeysFactory.journalEntries("journal-id", {}, {});
    const ofOtherJournal = queryKeysFactory.journalEntries("other-id", {}, {});

    queryClient.setQueryData(thisMonth, [entry, otherEntry]);
    queryClient.setQueryData(unfiltered, [otherEntry, entry]);
    queryClient.setQueryData(ofOtherJournal, [entry]);

    vi.spyOn(ServerApi, "upsertEntry").mockResolvedValue({
      entityId: "entry-id",
    });

    let mutation: ReturnType<typeof useUpsertEntryMutation> | undefined;

    const EntryEditor = () => {
      mutation = useUpsertEntryMutation(
        "journal-id",
        JournalType.Scraps,
        undefined,
        "entry-id",
      );

      return <div>entry editor</div>;
    };

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={createTestRouter(EntryEditor)} />
      </QueryClientProvider>,
    );

    await screen.findByText("entry editor");

    await act(() =>
      mutation!.mutateAsync({
        command: { id: "entry-id", journalId: "journal-id", notes: "after" },
      }),
    );

    const getNotes = (queryKey: unknown[]) =>
      queryClient.getQueryData<IEntry[]>(queryKey)?.map((e) => e.notes);

    expect(getNotes(thisMonth)).toEqual(["after", "untouched"]);
    expect(getNotes(unfiltered)).toEqual(["untouched", "after"]);
    expect(getNotes(ofOtherJournal)).toEqual(["before"]);
  });
});
