import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useScratchpad } from "./useScratchpad";
import { IScratchpad } from "../../serverApi/IScratchpad";

const draftKey = "engraved::scratchpad-draft";

let scratchpad: IScratchpad | null | undefined;
const save = vi.fn();

vi.mock("../../serverApi/reactQuery/queries/useScratchpadQuery", () => ({
  useScratchpadQuery: () => scratchpad,
}));

vi.mock(
  "../../serverApi/reactQuery/mutations/useSaveScratchpadMutation",
  () => ({
    useSaveScratchpadMutation: () => ({ mutate: save }),
  }),
);

function getDraft() {
  const draft = localStorage.getItem(draftKey);
  return draft === null ? undefined : JSON.parse(draft);
}

function setDraft(content: string) {
  localStorage.setItem(draftKey, JSON.stringify(content));
}

// Lets the save that was last asked for succeed.
function succeedSave() {
  const [, options] = save.mock.lastCall!;
  options.onSuccess();
}

describe("useScratchpad", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    save.mockReset();
    scratchpad = { content: "saved" };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is not loaded before the scratchpad is", () => {
    scratchpad = undefined;

    const { result } = renderHook(() => useScratchpad());

    expect(result.current.isLoaded).toBe(false);
  });

  it("shows nothing for a scratchpad that has never been saved", () => {
    scratchpad = null;

    const { result } = renderHook(() => useScratchpad());

    expect(result.current).toMatchObject({ isLoaded: true, content: "" });
  });

  it("shows what has been saved", () => {
    const { result } = renderHook(() => useScratchpad());

    expect(result.current.content).toBe("saved");
  });

  it("saves once typing has stopped for 2 seconds", () => {
    const { result } = renderHook(() => useScratchpad());

    act(() => result.current.edit("h"));
    act(() => vi.advanceTimersByTime(1000));
    act(() => result.current.edit("hi"));
    act(() => vi.advanceTimersByTime(1999));

    expect(save).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith("hi", expect.anything());
  });

  it("keeps what is typed as a draft until it is saved", () => {
    const { result } = renderHook(() => useScratchpad());

    act(() => result.current.edit("draft"));
    act(() => vi.advanceTimersByTime(2000));

    expect(getDraft()).toBe("draft");

    succeedSave();

    expect(getDraft()).toBeUndefined();
  });

  it("keeps the draft when a save fails", () => {
    const { result } = renderHook(() => useScratchpad());

    act(() => result.current.edit("important"));
    act(() => vi.advanceTimersByTime(2000));

    expect(getDraft()).toBe("important");
  });

  it("keeps what has been typed during a save as a draft", () => {
    const { result } = renderHook(() => useScratchpad());

    act(() => result.current.edit("first"));
    act(() => vi.advanceTimersByTime(2000));
    act(() => result.current.edit("first and more"));

    succeedSave();

    expect(getDraft()).toBe("first and more");
  });

  it("shows a draft instead of what has been saved and saves it", () => {
    setDraft("left over");

    const { result } = renderHook(() => useScratchpad());

    expect(result.current.content).toBe("left over");
    expect(save).toHaveBeenCalledWith("left over", expect.anything());
  });
});
