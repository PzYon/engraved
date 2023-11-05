import { test } from "@playwright/test";
import { constants } from "../src/constants";
import { addNewJournal } from "../src/utils/addNewJournal";

test.beforeEach(async ({ page }) => {
  await page.goto(constants.baseUrl);
});

const journalName = "My First Value Journal";
const renamedJournalName = journalName + " (renamed)";

test("adds new journal, updates journal", async ({ page }) => {
  let journalPage = await addNewJournal(
    page,
    "Value",
    journalName,
    "This is my description...",
  );

  await journalPage.validatePageTitle(journalName);
  await journalPage.validateHasNoEntries();

  const journalEditPage = await journalPage.navigateToEditPage();
  await journalEditPage.setName(renamedJournalName);

  journalPage = await journalEditPage.clickSave();

  await journalPage.validatePageTitle(renamedJournalName);
  await journalPage.validateHasNoEntries();
});
