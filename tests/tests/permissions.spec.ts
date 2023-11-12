import { test } from "@playwright/test";
import { login } from "../src/utils/login";
import { addNewJournal } from "../src/utils/addNewJournal";
import { JournalsPage } from "../src/poms/journalsPage";

test("multiple users", async ({ browser }) => {
  const joeContext = await browser.newContext();
  const joePage = await joeContext.newPage();

  await login(joePage, "permissions-joe");

  const joesJournalName = "I'm Joe's";
  const joesJournalPage = await addNewJournal(
    joePage,
    "Value",
    joesJournalName,
  );
  const joesJournalId = await joesJournalPage.getJournalId();

  const bobContext = await browser.newContext();
  const bobPage = await bobContext.newPage();
  const bobsUserName = await login(bobPage, "permissions-bob");

  const bobsJournalsPage = new JournalsPage(bobPage);
  await bobsJournalsPage.expectNotToShowJournal(joesJournalId);

  const joesPermissionsDialog = await joesJournalPage.clickPermissionsAction();
  await joesPermissionsDialog.addUserWithWritePermissions(bobsUserName);
  await joesPermissionsDialog.savePermissionsAndCloseDialog();

  await bobsJournalsPage.clickRefreshData();
  await bobsJournalsPage.expectToShowJournal(joesJournalId);

  const journalPageAsBob =
    await bobsJournalsPage.navigateToJournalPage(joesJournalName);
  await journalPageAsBob.addValue("42");
  await journalPageAsBob.expectTableCellToHaveValue("42");

  await joesJournalPage.clickRefreshData();
  await joesJournalPage.expectTableCellToHaveValue("42");
});
