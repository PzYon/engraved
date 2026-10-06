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

test("replaces a markdown note being edited with the version saved in another tab", async ({
  page,
  testData,
}) => {
  const { journals } = await testData.seed({
    journals: [{ name: "My Notes", type: "Scraps" }],
  });
  await page.goto(`/journals/details/${journals[0].journalId}`);

  await new ScrapsJournalPage(page).addEntry("My note", "Hello");

  // same context, so the second tab is the same user
  const otherPage = await page.context().newPage();
  await otherPage.goto(page.url());

  const note = new ScrapMarkdownComponent(page);
  const noteInOtherTab = new ScrapMarkdownComponent(otherPage);

  await note.dblClickToEdit();
  await note.typeAtEnd(" unsaved");
  await note.typeTitleAtEnd(" discarded");

  await noteInOtherTab.dblClickToEdit();
  await noteInOtherTab.typeAtEnd(" from tab two");
  await noteInOtherTab.typeTitleAtEnd(" renamed");
  await noteInOtherTab.clickSave();

  // Playwright does not fire the events react-query refetches on when a tab is
  // brought to the front, so they are dispatched by hand.
  await page.evaluate(() => {
    window.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("focus"));
  });

  await expect(
    page.getByText("Would you like to update? Any changes will be lost"),
  ).toBeVisible();

  await page.getByRole("button", { name: "YES" }).click();

  await note.expectEditorContent("Hello from tab two");
  await note.expectTitleEditorContent("My note renamed");

  // what was discarded must not come back with the next save either
  await note.typeAtEnd(" and tab one");
  await note.clickSave();

  await page.reload();

  await note.expectContent("Hello from tab two and tab one");
  await note.expectContent("My note renamed");
  await note.expectNoContent("discarded");
});

test("does not save a title that was discarded by cancelling the edit", async ({
  page,
  testData,
}) => {
  const { journals } = await testData.seed({
    journals: [{ name: "My Notes", type: "Scraps" }],
  });
  await page.goto(`/journals/details/${journals[0].journalId}`);

  await new ScrapsJournalPage(page).addEntry("My note", "Hello");

  const note = new ScrapMarkdownComponent(page);

  await note.dblClickToEdit();
  await note.typeTitleAtEnd(" discarded");
  await note.cancelEditingAndDiscardChanges();

  await note.dblClickToEdit();
  await note.typeAtEnd(" world");
  await note.clickSave();

  await page.reload();

  await note.expectContent("Hello world");
  await note.expectContent("My note");
  await note.expectNoContent("discarded");
});
