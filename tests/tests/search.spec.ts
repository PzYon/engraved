import { Page, test } from "@playwright/test";
import { login } from "../src/utils/login";
import { addNewJournal } from "../src/utils/addNewJournal";
import { navigateToSearchPage } from "../src/utils/navigateTo";
import { ScrapsJournalPage } from "../src/poms/scrapsJournalPage";

type Entry = { title: string; content?: string };

async function createScrapsJournalWithEntries(
  page: Page,
  journalName: string,
  entries: Entry[],
  journalDescription?: string,
): Promise<void> {
  await addNewJournal(page, "Scraps", journalName, journalDescription);
  const journalPage = new ScrapsJournalPage(page);
  for (const entry of entries) {
    await journalPage.addEntry(entry.title, entry.content);
  }
}

test.beforeEach(async ({ page }) => {
  await login(page, "search");
});

test("finds entry by title match", async ({ page }) => {
  await createScrapsJournalWithEntries(page, "My Journal", [
    { title: "Alpine Trek" },
  ]);

  const searchPage = await navigateToSearchPage(page);
  await searchPage.search("Alpine");
  await searchPage.expectResultVisible("Alpine Trek");
});

test("finds entry by content match", async ({ page }) => {
  await createScrapsJournalWithEntries(page, "My Journal", [
    { title: "Walk notes", content: "unexplored canyon route" },
  ]);

  const searchPage = await navigateToSearchPage(page);
  await searchPage.search("canyon");
  await searchPage.expectResultVisible("Walk notes");
});

test("finds journal by name match", async ({ page }) => {
  await addNewJournal(page, "Scraps", "Birding Log");

  const searchPage = await navigateToSearchPage(page);
  await searchPage.search("Birding");
  await searchPage.expectResultVisible("Birding Log");
});

test("finds journal by description match", async ({ page }) => {
  await addNewJournal(page, "Scraps", "Field Journal", "wetland observations");

  const searchPage = await navigateToSearchPage(page);
  await searchPage.search("wetland");
  await searchPage.expectResultVisible("Field Journal");
});

test("returns both entries and journals when both match", async ({ page }) => {
  await createScrapsJournalWithEntries(page, "Geology Study", [
    { title: "Geology Study notes" },
  ]);

  const searchPage = await navigateToSearchPage(page);
  await searchPage.search("Geology Study");
  await searchPage.expectResultVisible("Geology Study");
  await searchPage.expectResultVisible("Geology Study notes");
});

test("shows no results for non-matching search", async ({ page }) => {
  const searchPage = await navigateToSearchPage(page);
  await searchPage.search("zzznomatch999");
  await searchPage.expectNoResults();
});

test("narrows and widens search updates results", async ({ page }) => {
  await createScrapsJournalWithEntries(page, "Wildlife Journal", [
    { title: "Red Fox" },
    { title: "Red Kite" },
    { title: "Blue Jay" },
  ]);

  const searchPage = await navigateToSearchPage(page);

  await searchPage.search("Red");
  await searchPage.expectResultVisible("Red Fox");
  await searchPage.expectResultVisible("Red Kite");
  await searchPage.expectResultNotVisible("Blue Jay");

  await searchPage.search("Red Fox");
  await searchPage.expectResultVisible("Red Fox");
  await searchPage.expectResultNotVisible("Red Kite");

  await searchPage.clearSearch();
  await searchPage.search("Red");
  await searchPage.expectResultVisible("Red Fox");
  await searchPage.expectResultVisible("Red Kite");
});
