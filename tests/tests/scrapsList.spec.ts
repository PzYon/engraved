import { test } from "@playwright/test";
import { addNewJournal } from "../src/utils/addNewJournal";
import { login } from "../src/utils/login";
import { ScrapsJournalPage } from "../src/poms/scrapsJournalPage";

const firstItemText = "My First Item";
const secondItemText = "My Second Item";
const thirdItemText = "My Third Item";

test("add scrap journal, add list entry and add/delete/modify", async ({
  page,
}) => {
  await login(page, "scrapsList");

  await addNewJournal(page, "Scraps", "My First Scraps Journal");

  const scrapsJournalPage = new ScrapsJournalPage(page);
  await scrapsJournalPage.expectIsEmpty();

  const scrapList = await scrapsJournalPage.addList();
  await scrapList.typeTitle("This is my title");
  await scrapList.addListItem(firstItemText);
  await scrapList.addListItem(secondItemText);

  await scrapList.clickSave();

  await scrapList.dblClickToEdit();

  await scrapList
    .getListItemByText(secondItemText)
    .getByLabel("Delete")
    .click();

  await scrapList
    .getListItemByText(firstItemText)
    .getByRole("checkbox")
    .check();

  // todo:
  // - edit, add again, validate
  // - mark as checked in non-edit mode

  await scrapList.clickSave(true);
});

test("MULTIPLE WINDOWS", async ({ browser }) => {
  const context = await browser.newContext();
  const pageTab1 = await context.newPage();
  await login(pageTab1, "background-update-joe");

  await addNewJournal(pageTab1, "Scraps", "Simple Scrap");

  const scrapsJournalPageTab1 = new ScrapsJournalPage(pageTab1);

  const scrapListTab1 = await scrapsJournalPageTab1.addList();
  await scrapListTab1.typeTitle("I is list");
  await scrapListTab1.addListItem(firstItemText);
  await scrapListTab1.addListItem(secondItemText);
  await scrapListTab1.clickSave();

  // second
  const pageTab2 = await context.newPage();
  await pageTab2.goto(pageTab1.url());

  const scrapsJournalPageTab2 = new ScrapsJournalPage(pageTab2);
  const scrapListTab2 = await scrapsJournalPageTab2.getListByTitle("I is list");
  await scrapListTab2.dblClickToEdit();
  await scrapListTab2.addListItem(thirdItemText);
  await scrapListTab2.clickSave(true);

  await pageTab1.evaluate(() => {
    document.dispatchEvent(new Event("visibilitychange"));
  });
});
