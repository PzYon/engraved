import { test } from "@playwright/test";
import { constants } from "../src/constants";
import { addNewJournal } from "../src/addNewJournal";

test.beforeEach(async ({ page }) => {
  await page.goto(constants.baseUrl);
});

test("adds new quick scrap", async ({ page }) => {
  const journalPage = await addNewJournal(
    page,
    "Scraps",
    "My Manual Quick Scraps",
  );

  const journalsPage = await journalPage.navigateToHome();

  const quickScrapDialog = await journalsPage.clickAddQuickScrap();
  await quickScrapDialog.typeName("Quick Scrap Title");
  await quickScrapDialog.typeContent("This is my content...");
  await quickScrapDialog.clickSave();

  const entriesPage = await journalsPage.navigateToEntries();
  await entriesPage.expectItem(0, "Quick Scrap Title", "This is my content...");
});
