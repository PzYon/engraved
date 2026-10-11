import { beforeEach, describe, expect, it, vi } from "vitest";
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
    localStorage.clear();
    save.mockReset();
    scratchpad = { content: "saved" };
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

  it("saves what has been typed, and only that", () => {
    const { result } = renderHook(() => useScratchpad());

    act(() => result.current.edit("hi"));

    expect(save).not.toHaveBeenCalled();

    act(() => result.current.save());

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith("hi", expect.anything());
  });

  it("saves nothing when nothing has been typed", () => {
    const { result } = renderHook(() => useScratchpad());

    act(() => result.current.save());

    expect(save).not.toHaveBeenCalled();
  });

  it("keeps what is typed as a draft until it is saved", () => {
    const { result } = renderHook(() => useScratchpad());

    act(() => result.current.edit("draft"));
    act(() => result.current.save());

    expect(getDraft()).toBe("draft");

    succeedSave();

    expect(getDraft()).toBeUndefined();
  });

  it("keeps what has been typed during a save as a draft", () => {
    const { result } = renderHook(() => useScratchpad());

    act(() => result.current.edit("first"));
    act(() => result.current.save());
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
