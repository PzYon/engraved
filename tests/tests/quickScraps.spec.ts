import { test } from "@playwright/test";
import { login } from "../src/utils/login";
import { addNewJournal } from "../src/utils/addNewJournal";

test.beforeEach(async ({ page }) => {
  await login(page, "quickScraps");
});

const scrapTitle = "Quick Scrap Title";
const scrapContent = "This is my content...";

test("add quick scrap", async ({ page }) => {
  const journalPage = await addNewJournal(
    page,
    "Scraps",
    "My Manual Quick Scraps",
  );

  const journalsPage = await journalPage.navigateToHome();

  const quickScrapDialog = await journalsPage.clickAddQuickScrapAction();
  await quickScrapDialog.typeName(scrapTitle);
  await quickScrapDialog.typeContent(scrapContent);
  await quickScrapDialog.clickSave();

  const entriesPage = await journalsPage.navigateToEntriesPage();
  await entriesPage.expectItem(0, scrapTitle, scrapContent);
});
