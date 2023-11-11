import { test } from "@playwright/test";
import { login } from "../src/constants";
import { addNewJournal } from "../src/utils/addNewJournal";
import { JournalsPage } from "../src/poms/journalsPage";

test("multiple users", async ({ browser }) => {
  const joeContext = await browser.newContext();
  const joePage = await joeContext.newPage();

  await login(joePage, "permissions-joe");

  const joesJournalPage = await addNewJournal(joePage, "Value", "I'm Joe's");
  const joesJournalId = await joesJournalPage.getJournalId();

  const bobContext = await browser.newContext();
  const bobPage = await bobContext.newPage();
  const bobsUserName = await login(bobPage, "permissions-bob");

  const bobsJournalsPage = new JournalsPage(bobPage);
  await bobsJournalsPage.expectNotToShowJournal(joesJournalId);

  const joesPermissionsDialog = await joesJournalPage.clickPermissionsAction();
  await joesPermissionsDialog.addUserWithWritePermissions(bobsUserName);
  await joesPermissionsDialog.savePermissions();

  await bobsJournalsPage.clickRefreshData();
  await bobsJournalsPage.expectToShowJournal(joesJournalId);
});

/*
  await page.getByLabel('Permissions').click();

  await page.getByLabel('Mail Address').click();
  await page.getByLabel('Mail Address').fill('XYZ@heiri.com');

  await page.getByLabel('Read').click();
  await page.getByRole('option', { name: 'Write' }).click();

  await page.getByLabel('Add', { exact: true }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByText('Modified journal permissions').click();
 */
