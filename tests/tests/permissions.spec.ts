import { test } from "@playwright/test";
import { login } from "../src/utils/login";
import { addNewJournal } from "../src/utils/addNewJournal";
import { JournalsPage } from "../src/poms/journalsPage";
import { navigateToJournalPage } from "../src/utils/navigateTo";
import { ScrapsJournalPage } from "../src/poms/scrapsJournalPage";
import { ScrapMarkdownComponent } from "../src/poms/scrapMarkdownComponent";

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
  await bobsJournalsPage.expectNotToShowEntity(joesJournalId);

  const joesPermissionsAction = await joesJournalPage.clickPermissionsAction();
  await joesPermissionsAction.addUserWithWritePermissions(bobsUserName);
  await joesPermissionsAction.savePermissionsAndCloseDialog();

  await bobsJournalsPage.clickRefreshData();
  await bobsJournalsPage.expectToShowEntity(joesJournalId);

  const journalPageAsBob = await navigateToJournalPage(
    bobPage,
    joesJournalName,
  );
  await journalPageAsBob.addValue("42");
  await journalPageAsBob.expectTableCellToHaveValue("42");

  await joesJournalPage.clickRefreshData();
  await joesJournalPage.expectTableCellToHaveValue("42");
});

test("multiple users editing the same scrap", async ({ browser }) => {
  const joeContext = await browser.newContext();
  const joePage = await joeContext.newPage();

  await login(joePage, "shared-scrap-joe");

  const joesJournalName = "Joe's notes";
  const joesJournalPage = await addNewJournal(
    joePage,
    "Scraps",
    joesJournalName,
  );
  const joesJournalId = await joesJournalPage.getJournalId();

  const joesScrapsPage = new ScrapsJournalPage(joePage);
  await joesScrapsPage.addEntry("Shared note", "Hello");

  const bobContext = await browser.newContext();
  const bobPage = await bobContext.newPage();
  const bobsUserName = await login(bobPage, "shared-scrap-bob");

  const bobsJournalsPage = new JournalsPage(bobPage);
  await bobsJournalsPage.expectNotToShowEntity(joesJournalId);

  const joesPermissionsAction = await joesJournalPage.clickPermissionsAction();
  await joesPermissionsAction.addUserWithWritePermissions(bobsUserName);
  await joesPermissionsAction.savePermissionsAndCloseDialog();

  await bobsJournalsPage.clickRefreshData();
  await bobsJournalsPage.expectToShowEntity(joesJournalId);

  await navigateToJournalPage(bobPage, joesJournalName);

  const scrapAsBob = new ScrapMarkdownComponent(bobPage);
  await scrapAsBob.expectContent("Hello");

  await scrapAsBob.dblClickToEdit();
  await scrapAsBob.typeAtEnd(" from Bob");
  await scrapAsBob.blurToAutoSave(true);

  await joePage.reload();

  const scrapAsJoe = new ScrapMarkdownComponent(joePage);
  await scrapAsJoe.expectContent("Hello from Bob");

  await scrapAsJoe.dblClickToEdit();
  await scrapAsJoe.typeAtEnd(" and Joe");
  await scrapAsJoe.blurToAutoSave(true);

  await joePage.reload();
  await scrapAsJoe.expectContent("Hello from Bob and Joe");

  await bobPage.reload();
  await scrapAsBob.expectContent("Hello from Bob and Joe");
});
