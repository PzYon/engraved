import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { IScrapEntry, ScrapType } from "../../../serverApi/IScrapEntry";
import { useScrapToRender } from "./useScrapToRender";

function createScrap(title: string, notes: string): IScrapEntry {
  return {
    id: "scrap-id",
    parentId: "journal-id",
    scrapType: ScrapType.Markdown,
    title,
    notes,
  } as IScrapEntry;
}

describe("useScrapToRender", () => {
  it("starts with the scrap it was given", () => {
    const scrap = createScrap("Title", "Notes");

    const { result } = renderHook(() => useScrapToRender(scrap));

    expect(result.current.scrapToRender).toBe(scrap);
    expect(result.current.parsedDate).toBeUndefined();
  });

  it("keeps the edits when a newer scrap comes in", () => {
    const { result, rerender } = renderHook(
      (scrap: IScrapEntry) => useScrapToRender(scrap),
      { initialProps: createScrap("Title", "Notes") },
    );

    act(() =>
      result.current.setScrapToRender((prev) => ({ ...prev, notes: "Mine" })),
    );

    const keyBefore = result.current.editorKey;

    rerender(createScrap("Title", "Theirs"));

    expect(result.current.scrapToRender.notes).toBe("Mine");
    expect(result.current.editorKey).toBe(keyBefore);
  });

  it("resets to the newest scrap, drops the parsed date and changes the editor key", () => {
    const { result, rerender } = renderHook(
      (scrap: IScrapEntry) => useScrapToRender(scrap),
      { initialProps: createScrap("Title", "Notes") },
    );

    act(() => {
      result.current.setScrapToRender((prev) => ({ ...prev, title: "Mine" }));
      result.current.setParsedDate({ input: "Mine", text: "Mine" });
    });

    const keyBefore = result.current.editorKey;
    const newerScrap = createScrap("Theirs", "Notes");

    rerender(newerScrap);
    act(() => result.current.resetToInitialScrap());

    expect(result.current.scrapToRender).toBe(newerScrap);
    expect(result.current.parsedDate).toBeUndefined();
    expect(result.current.editorKey).not.toBe(keyBefore);
  });
});
