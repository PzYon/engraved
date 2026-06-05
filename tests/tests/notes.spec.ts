import { expect, test } from "@playwright/test";
import { login } from "../src/utils/login";
import { ScrapsJournalPage } from "../src/poms/scrapsJournalPage";
import { ScrapMarkdownComponent } from "../src/poms/scrapMarkdownComponent";

test("auto-saves markdown note changes when focus leaves the scrap", async ({
  page,
}) => {
  await login(page, "notes-autosave", "Scraps", "My Notes");

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
