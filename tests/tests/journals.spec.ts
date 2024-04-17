import { test } from "@playwright/test";
import { login } from "../src/utils/login";
import { addNewJournal } from "../src/utils/addNewJournal";
import { navigateToHome } from "../src/utils/navigateTo";
import { JournalsPage } from "../src/poms/journalsPage";

test.beforeEach(async ({ page }) => {
  await login(page, "journals");
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

  await journalPage.expectPageTitle(journalName);
  await journalPage.validateHasNoEntries();

  const journalEditPage = await journalPage.navigateToEditPage();
  await journalEditPage.setName(renamedJournalName);

  journalPage = await journalEditPage.clickSave();

  await journalPage.expectPageTitle(renamedJournalName);
  await journalPage.validateHasNoEntries();

  const journalId = await journalPage.getJournalId();

  await navigateToHome(page);
  const journalsPage = new JournalsPage(page);
  await journalsPage.expectToShowEntity(journalId);
});

test("add journal, delete journal", async ({ page }) => {
  const journalName = "My First Timer Journal";

  const journalPage = await addNewJournal(page, "Timer", journalName);
  const journalId = await journalPage.getJournalId();

  const deleteDialog = await journalPage.navigateToDeleteJournalDialog();

  await deleteDialog.clickFirstDeleteButton();
  await deleteDialog.typeInConfirmationTextBox("delete");
  await deleteDialog.clickSecondDeleteButton();

  await navigateToHome(page);
  const journalsPage = new JournalsPage(page);
  await journalsPage.expectNotToShowEntity(journalId);
});
