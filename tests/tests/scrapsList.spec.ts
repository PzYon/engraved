import { expect, Page, test } from "@playwright/test";
import { addNewJournal } from "../src/utils/addNewJournal";
import { login } from "../src/utils/login";
import { ScrapsJournalPage } from "../src/poms/scrapsJournalPage";
import { ScrapListComponent } from "../src/poms/scrapListComponent";

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
  const scrapId = await scrapListTab1.clickSave();

  // second
  const pageTab2 = await context.newPage();
  await pageTab2.goto(pageTab1.url());

  const scrapListTab2 = new ScrapListComponent(pageTab2, scrapId);
  await scrapListTab2.dblClickToEdit();
  await scrapListTab2.addListItem(thirdItemText);
  await scrapListTab2.clickSave(true);

  await expect(
    await scrapListTab1.getListItemByText(thirdItemText),
  ).toBeHidden();

  await triggerFocusEvent(pageTab1);

  await expect(
    await scrapListTab1.getListItemByText(thirdItemText),
  ).toBeVisible();

  await scrapListTab1.dblClickToEdit();
  await scrapListTab1.addListItem("Not saved item");

  await scrapListTab2.dblClickToEdit();
  await scrapListTab2.addListItem("Will be saved item");
  await scrapListTab2.clickSave();
});

async function triggerFocusEvent(page: Page) {
  await page.evaluate(() => {
    document.dispatchEvent(new Event("visibilitychange"));
    document.dispatchEvent(new Event("focus"));
  });

  await page.evaluate(() => {
    document.dispatchEvent(new Event("visibilitychange"));
    document.dispatchEvent(new Event("focus"));
  });
}
