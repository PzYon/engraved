import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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
  ScheduledInfo: () => <span>in 2 days</span>,
}));

const recurringSchedule: ISchedule = {
  nextOccurrence: "2020-01-01T10:00:00Z",
  recurrence: { dateString: "every 2 days" },
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
