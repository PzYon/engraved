import { test } from "@playwright/test";
import { addNewJournal } from "../src/utils/addNewJournal";
import { constants } from "../src/constants";
import { ScrapsJournalPage } from "../src/pmos/scrapsJournalPage";

test.beforeEach(async ({ page }) => {
  await page.goto(constants.baseUrl);
});

const journalName = "My First Scraps Journal";

test("adds new scrap journal, adds list and adds some items to it", async ({
  page,
}) => {
  await addNewJournal(page, "Scraps", journalName);

  const scrapsJournalPage = new ScrapsJournalPage(page);
  await scrapsJournalPage.expectIsEmpty();

  const scrapList = await scrapsJournalPage.addList();
  await scrapList.typeTitle("This is my title");
  await scrapList.addListItem("My First Item");
  await scrapList.addListItem("My Second Item");

  await scrapList.clickSave();

  await page.getByText("My Second Item").dblclick();

  await page
    .locator("li")
    .filter({ hasText: "My Second Item" })
    .getByLabel("Delete")
    .click();

  await page
    .locator("li")
    .filter({ hasText: "My First Item" })
    .getByRole("checkbox")
    .check();

  await scrapList.clickSave(true);
});
