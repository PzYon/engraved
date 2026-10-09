import { describe, it, expect } from "vitest";
import { queryKeysFactory } from "./queryKeysFactory";

describe("queryKeysFactory", () => {
  describe("isWorthPersisting", () => {
    it.each([
      ["a journal", queryKeysFactory.journal("journal-id")],
      ["the journals", queryKeysFactory.journals()],
      ["the entries of a journal", queryKeysFactory.journalEntries("id")],
      ["all entries", queryKeysFactory.entries()],
      ["the system info", queryKeysFactory.systemInfo()],
    ])("should keep %s across a reload", (_, queryKey) => {
      expect(queryKeysFactory.isWorthPersisting(queryKey)).toBe(true);
    });

    it.each([
      ["what a search returned", queryKeysFactory.entities("some text")],
      [
        "what is related to an entry",
        queryKeysFactory.relatedEntities("entry-id", "Entry"),
      ],
      ["the URL of a file", queryKeysFactory.fileUrl("file-id")],
      ["whether a new version is out", queryKeysFactory.appVersion()],
    ])("should not keep %s across a reload", (_, queryKey) => {
      expect(queryKeysFactory.isWorthPersisting(queryKey)).toBe(false);
    });
  });
});
