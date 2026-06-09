import { expect } from "@playwright/test";
import { test } from "../src/fixtures";
import { ScrapsJournalPage } from "../src/poms/scrapsJournalPage";
import { ScrapMarkdownComponent } from "../src/poms/scrapMarkdownComponent";

test("auto-saves markdown note changes when focus leaves the scrap", async ({
  page,
  testData,
}) => {
  const { journals } = await testData.seed({
    journals: [{ name: "My Notes", type: "Scraps" }],
  });
  await page.goto(`/journals/details/${journals[0].journalId}`);

  const scrapsJournalPage = new ScrapsJournalPage(page);
  await scrapsJournalPage.expectIsEmpty();

  await scrapsJournalPage.addEntry("This is my note", "Hello");

  const note = new ScrapMarkdownComponent(page);
  await note.expectContent("Hello");

  // edit the existing note and append some text, but do NOT click save:
  // moving focus out of the scrap should auto-save the pending change.
  await note.dblClickToEdit();
  await note.typeAtEnd(" world");

  await note.blurToAutoSave(true);

  // auto-save must NOT leave edit mode - the user stays in the editor until
  // they explicitly save. The "Save" action is only present while editing.
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeVisible();

  // the change is persisted: after a reload the appended text is still there.
  await page.reload();

  await note.expectContent("Hello world");
});
