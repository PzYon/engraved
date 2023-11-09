import { test } from "@playwright/test";
import { getStartUrl } from "../src/constants";
import { addNewJournal } from "../src/utils/addNewJournal";

let counter = 1;

test.beforeEach(async ({ page }) => {
  await page.goto(getStartUrl("quickScraps", (counter++).toString()));
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

  const quickScrapDialog = await journalsPage.clickAddQuickScrap();
  await quickScrapDialog.typeName(scrapTitle);
  await quickScrapDialog.typeContent(scrapContent);
  await quickScrapDialog.clickSave();

  const entriesPage = await journalsPage.navigateToEntries();
  await entriesPage.expectItem(0, scrapTitle, scrapContent);
});
