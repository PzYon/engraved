import { test } from "@playwright/test";
import { constants } from "../src/constants";
import { addNewJournal } from "../src/utils/addNewJournal";

test.beforeEach(async ({ page }) => {
  await page.goto(constants.baseUrl);
});

test("add journal, update journal", async ({ page }) => {
  const journalName = "My First Value Journal";
  const renamedJournalName = journalName + " (renamed)";

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

  const journalId = await journalPage.getJournalId();
  const journalsPage = await journalPage.navigateToHome();
  await journalsPage.expectToShowJournal(journalId);
});

test("add journal, delete journal", async ({ page }) => {
  const journalName = "My First Timer Journal";

  const journalPage = await addNewJournal(page, "Timer", journalName);
  const journalId = await journalPage.getJournalId();

  const deleteDialog = await journalPage.navigateToDeleteJournalDialog();

  await deleteDialog.clickFirstDeleteButton();
  await deleteDialog.typeInConfirmationTextBox("delete");
  await deleteDialog.clickSecondDeleteButton();

  const journalsPage = await journalPage.navigateToHome();
  await journalsPage.expectNotToShowJournal(journalId);
});
