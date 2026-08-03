import { describe, expect, it } from "vitest";
import {
  getReferencedFileIds,
  resolveFileUrls,
  toStoredMarkdown,
} from "./fileReferences";

const fileId = "3eaf7d70f664434e9540f568fc954ba2.mc7bwltHC9O80ZF7SNp6bb";

const signedUrl = `https://engravedfiles.blob.core.windows.net/engravedfiles/${fileId}?sv=2025-11-05&se=2026-08-02T20%3A36%3A20Z&sr=b&sp=r&sig=abc%3D`;

describe("getReferencedFileIds", () => {
  it("finds the ids of images placed in the markdown", () => {
    expect(getReferencedFileIds(`![one](engraved:file/${fileId})`)).toEqual([
      fileId,
    ]);
  });

  it("returns each id once, however often it is placed", () => {
    const markdown = `![one](engraved:file/${fileId})\n\n![again](engraved:file/${fileId})`;

    expect(getReferencedFileIds(markdown)).toEqual([fileId]);
  });

  it("ignores images that are not file references", () => {
    expect(getReferencedFileIds("![cat](https://example.com/cat.png)")).toEqual(
      [],
    );
  });

  it("ignores links, which are not images", () => {
    expect(getReferencedFileIds(`[one](engraved:file/${fileId})`)).toEqual([]);
  });
});

describe("resolveFileUrls", () => {
  it("swaps a reference for the url it resolves to", () => {
    const result = resolveFileUrls(`![one](engraved:file/${fileId})`, {
      [fileId]: signedUrl,
    });

    expect(result).toBe(`![one](${signedUrl})`);
  });

  it("leaves a reference alone when there is no url for it yet", () => {
    const markdown = `![one](engraved:file/${fileId})`;

    expect(resolveFileUrls(markdown, {})).toBe(markdown);
  });

  it("keeps the title of an image", () => {
    const result = resolveFileUrls(
      `![one](engraved:file/${fileId} "a title")`,
      {
        [fileId]: signedUrl,
      },
    );

    expect(result).toBe(`![one](${signedUrl} "a title")`);
  });

  it("leaves ordinary images alone", () => {
    const markdown = "![cat](https://example.com/cat.png)";

    expect(resolveFileUrls(markdown, { [fileId]: signedUrl })).toBe(markdown);
  });
});

describe("toStoredMarkdown", () => {
  it("turns a resolved url back into a reference", () => {
    expect(toStoredMarkdown(`![one](${signedUrl})`, [fileId])).toBe(
      `![one](engraved:file/${fileId})`,
    );
  });

  // The case this exists for: without it the signature would be saved into the scrap, render for an
  // hour and then break, on content already stored.
  it("turns a signed url back even when the entry no longer lists the file", () => {
    expect(toStoredMarkdown(`![one](${signedUrl})`, [])).toBe(
      `![one](engraved:file/${fileId})`,
    );
  });

  it("leaves an image the user linked from elsewhere alone", () => {
    const markdown = "![cat](https://example.com/cat.png)";

    expect(toStoredMarkdown(markdown, [fileId])).toBe(markdown);
  });

  it("leaves a reference that was never resolved alone", () => {
    const markdown = `![one](engraved:file/${fileId})`;

    expect(toStoredMarkdown(markdown, [fileId])).toBe(markdown);
  });

  it("round trips", () => {
    const stored = `before\n\n![one](engraved:file/${fileId})\n\nafter`;

    const resolved = resolveFileUrls(stored, { [fileId]: signedUrl });

    expect(toStoredMarkdown(resolved, [fileId])).toBe(stored);
  });
});
