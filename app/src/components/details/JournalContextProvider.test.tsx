import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JournalContextProvider } from "./JournalContextProvider";
import { useJournalContext } from "./JournalContext";
import { ServerApi } from "../../serverApi/ServerApi";
import { IJournal } from "../../serverApi/IJournal";
import { IEntry } from "../../serverApi/IEntry";

vi.mock("../../AppContext", () => ({
  useAppContext: () => ({ setAppAlert: vi.fn() }),
}));

function ContextReader({
  onContext,
}: {
  onContext: (ctx: ReturnType<typeof useJournalContext>) => void;
}) {
  onContext(useJournalContext());
  return null;
}

describe("JournalContextProvider", () => {
  const entries = [{ id: "entry-id", dateTime: "2026-10-09T12:00:00" }];

  const getJournalEntries = vi.spyOn(ServerApi, "getJournalEntries");

  beforeEach(() => {
    vi.spyOn(ServerApi, "getJournal").mockResolvedValue({
      id: "journal-id",
    } as IJournal);

    getJournalEntries.mockReset().mockResolvedValue(entries as IEntry[]);
  });

  function renderProvider() {
    let ctx: ReturnType<typeof useJournalContext> | undefined;

    render(
      <QueryClientProvider client={new QueryClient()}>
        <JournalContextProvider journalId="journal-id">
          <ContextReader onContext={(c) => (ctx = c)} />
        </JournalContextProvider>
      </QueryClientProvider>,
    );

    return () => ctx!;
  }

  it("does not load entries before date conditions are set", async () => {
    const getContext = renderProvider();

    await waitFor(() => expect(getContext().journal).toBeDefined());

    expect(getJournalEntries).not.toHaveBeenCalled();
    expect(getContext().entries).toEqual([]);
    expect(getContext().dateConditions).toEqual({});
  });

  it("loads entries once, with the date conditions that were set", async () => {
    const getContext = renderProvider();
    const dateConditions = {
      from: new Date(2026, 3, 12),
      to: new Date(2026, 9, 9),
    };

    act(() => getContext().setDateConditions(dateConditions));

    await waitFor(() => expect(getContext().entries).toEqual(entries));

    expect(getJournalEntries).toHaveBeenCalledTimes(1);
    expect(getJournalEntries).toHaveBeenCalledWith(
      "journal-id",
      {},
      dateConditions,
      "",
    );
  });

  it("loads all entries when empty date conditions are set", async () => {
    const getContext = renderProvider();

    act(() => getContext().setDateConditions({}));

    await waitFor(() => expect(getContext().entries).toEqual(entries));

    expect(getJournalEntries).toHaveBeenCalledTimes(1);
    expect(getJournalEntries).toHaveBeenCalledWith("journal-id", {}, {}, "");
  });
});
