import { test } from "@playwright/test";
import { addNewJournal } from "../src/utils/addNewJournal";
import { login } from "../src/utils/login";
import { ScrapsJournalPage } from "../src/poms/scrapsJournalPage";

test.beforeEach(async ({ page }) => {
  await login(page, "scrapsList");
});

const firstItemText = "My First Item";
const secondItemText = "My Second Item";

test("add scrap journal, add list entry and add/delete/modify", async ({
  page,
}) => {
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

  // todo: edit, add again, validate

  await scrapList.clickSave(true);
});
