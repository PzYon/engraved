import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { UseMutationResult } from "@tanstack/react-query";
import { ScheduleActions } from "./ScheduleActions";
import { ISchedule } from "../../../serverApi/ISchedule";
import { IEntry } from "../../../serverApi/IEntry";
import { ICommandResult } from "../../../serverApi/ICommandResult";
import { IScheduleDefinition } from "../../../serverApi/IScheduleDefinition";

const closeAction = vi.fn();
const mutate = vi.fn();

vi.mock("../../common/actions/searchParamHooks", () => ({
  useItemAction: () => ({ closeAction }),
  getItemActionQueryParams: () => ({}),
}));

vi.mock("../../overview/overviewList/OverviewListContext", () => ({
  useOverviewListContext: () => ({ keepFocusAtIndex: vi.fn() }),
}));

vi.mock("../../overview/scheduled/ScheduledInfo", () => ({
  ScheduledInfo: ({ schedule }: { schedule: ISchedule }) => (
    <span data-testid="next-occurrence">{schedule.nextOccurrence}</span>
  ),
}));

const recurringSchedule: ISchedule = {
  nextOccurrence: "2020-01-01T10:00:00Z",
  recurrence: { dateString: "every sat 15:00" },
};

const renderActions = (isRecurring: boolean, isInPast: boolean) =>
  render(
    <ScheduleActions
      hasSchedule={true}
      isRecurring={isRecurring}
      isInPast={isInPast}
      schedule={isRecurring ? recurringSchedule : { nextOccurrence: "x" }}
      entry={{ id: "entry-id", parentId: "journal-id" } as IEntry}
      modifyScheduleMutation={
        { mutate } as unknown as UseMutationResult<
          ICommandResult,
          Error,
          IScheduleDefinition,
          unknown
        >
      }
    />,
  );

describe("ScheduleActions", () => {
  beforeEach(() => {
    closeAction.mockClear();
    mutate.mockClear();
  });

  it("offers to clear the schedule of a due recurring entry", () => {
    renderActions(true, true);

    expect(screen.getByRole("button", { name: /Reschedule/ })).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Clear schedule" }));

    expect(mutate).toHaveBeenCalledWith({
      nextOccurrence: null,
      onClickUrl: null,
    });
    expect(closeAction).toHaveBeenCalled();
  });

  // The date a due schedule has stored is in the past. What is offered is
  // what its recurrence says, which the parser has to be loaded for first.
  it("offers to reschedule to the next occurrence of the recurrence", async () => {
    renderActions(true, true);

    expect(screen.getByTestId("next-occurrence").textContent).toBe("");

    await waitFor(() =>
      expect(
        new Date(screen.getByTestId("next-occurrence").textContent).getTime(),
      ).toBeGreaterThan(Date.now()),
    );
  });

  it("reschedules a due recurring entry to its next occurrence", async () => {
    renderActions(true, true);

    fireEvent.click(screen.getByRole("button", { name: /Reschedule/ }));

    await waitFor(() => expect(mutate).toHaveBeenCalled());

    const definition = mutate.mock.calls[0][0] as IScheduleDefinition;
    expect(definition.nextOccurrence?.getTime()).toBeGreaterThan(Date.now());
    expect(definition.recurrence).toEqual(recurringSchedule.recurrence);
    expect(closeAction).toHaveBeenCalled();
  });

  it("marks a non-recurring entry as done at once", () => {
    renderActions(false, true);

    fireEvent.click(screen.getByRole("button", { name: "Mark entry as done" }));

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({ nextOccurrence: null }),
    );
    expect(closeAction).toHaveBeenCalled();
  });

  it("does not offer to clear the schedule of a non-recurring entry", () => {
    renderActions(false, true);

    expect(
      screen.getByRole("button", { name: "Mark entry as done" }),
    ).toBeDefined();
    expect(screen.queryByRole("button", { name: "Clear schedule" })).toBeNull();
  });

  it("only offers to remove the schedule of an upcoming recurring entry", () => {
    renderActions(true, false);

    expect(
      screen.getByRole("button", { name: "Remove schedule" }),
    ).toBeDefined();
    expect(screen.queryByRole("button", { name: "Clear schedule" })).toBeNull();
  });
});
