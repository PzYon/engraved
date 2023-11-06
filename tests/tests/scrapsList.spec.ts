import { test } from "@playwright/test";
import { addNewJournal } from "../src/utils/addNewJournal";
import { constants } from "../src/constants";
import { ScrapsJournalPage } from "../src/poms/scrapsJournalPage";

test.beforeEach(async ({ page }) => {
  await page.goto(constants.baseUrl);
});

const firstItemText = "My First Item";
const secondItemText = "My Second Item";

test("adds new scrap journal, adds list and adds some items to it", async ({
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

  await scrapList.clickSave(true);
});
