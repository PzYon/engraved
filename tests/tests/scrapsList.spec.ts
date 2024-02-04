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
  await login(page, "scrapsList-basic");

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

test("add scrap journal, add list entries and mark as checked in non-edit mode", async ({
  page,
}) => {
  await login(page, "scrapsList-non-edit");

  await addNewJournal(page, "Scraps", "Random Scraps");

  const scrapsJournalPage = new ScrapsJournalPage(page);
  await scrapsJournalPage.expectIsEmpty();

  const scrapList = await scrapsJournalPage.addList();
  await scrapList.typeTitle("This is my title");
  await scrapList.addListItem(firstItemText);
  await scrapList.addListItem(secondItemText);
  await scrapList.clickSave();

  await scrapList
    .getListItemByText(firstItemText)
    .getByRole("checkbox")
    .check();

  await expect(
    scrapList.getListItemByText(firstItemText).getByRole("checkbox"),
  ).toBeChecked();

  await page.reload();

  await expect(
    scrapList.getListItemByText(firstItemText).getByRole("checkbox"),
  ).toBeChecked();

  await expect(
    scrapList.getListItemByText(secondItemText).getByRole("checkbox"),
  ).not.toBeChecked();
});

test("modify list items in multiple tabs, handle updates accordingly", async ({
  browser,
}) => {
  const context = await browser.newContext();

  // tab1: create journal and add scrap
  const pageTab1 = await context.newPage();
  await login(pageTab1, "background-update-joe");

  await addNewJournal(pageTab1, "Scraps", "Simple Scrap");

  const scrapsJournalPageTab1 = new ScrapsJournalPage(pageTab1);

  const scrapListTab1 = await scrapsJournalPageTab1.addList();
  await scrapListTab1.typeTitle("I is list");
  await scrapListTab1.addListItem(firstItemText);
  await scrapListTab1.addListItem(secondItemText);
  const scrapId = await scrapListTab1.clickSave();

  // tab2: go to created tab and add new item to list
  const pageTab2 = await context.newPage();
  await pageTab2.goto(pageTab1.url());

  const scrapListTab2 = new ScrapListComponent(pageTab2, scrapId);
  await scrapListTab2.dblClickToEdit();
  await scrapListTab2.addListItem(thirdItemText);
  await scrapListTab2.clickSave(true);

  // tab1: new item is not visible until window has gotten focus.
  // a note on "gotten focus": in real life this happens when to user
  // focuses a tab, in playwright however this does not (yet?) work,
  // because the corresponding events the react-query uses are not triggered.
  await expect(scrapListTab1.getListItemByText(thirdItemText)).toBeHidden();
  await triggerFocusEvent(pageTab1);
  await expect(scrapListTab1.getListItemByText(thirdItemText)).toBeVisible();

  // tab1: add new item (without saving - i.e. still in edit mode)
  await scrapListTab1.dblClickToEdit();
  await scrapListTab1.addListItem("Not saved item");

  // tab2: add new item (and save)
  await scrapListTab2.dblClickToEdit();
  await scrapListTab2.addListItem("Will be saved item");
  await scrapListTab2.clickSave(true);

  // tab1: give focus and expect "would you like to update?" message
  await triggerFocusEvent(pageTab1);

  await expect(
    pageTab1.getByText("Would you like to update? Any changes will be lost"),
  ).toBeVisible();

  await pageTab1.getByRole("button", { name: "YES" }).click();

  await expect(
    scrapListTab1.getListItemByText("Will be saved item"),
  ).toBeVisible();
});

test("perform common scrap list operations using shortcuts", async ({
  page,
}) => {
  await login(page, "scrapsList-short-cuts");

  await addNewJournal(page, "Scraps", "Scraps with shortcuts");

  const scrapsJournalPage = new ScrapsJournalPage(page);
  await scrapsJournalPage.expectIsEmpty();

  const scrapList = await scrapsJournalPage.addList();
  await scrapList.typeTitle("My Scraps");
  await scrapList.addListItem("First");
  await scrapList.clickSave(false);

  await scrapList.dblClickToEdit();

  await page.keyboard.press("Enter");
  await page.keyboard.type("Second");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Third");

  await expect(
    scrapList.getListItem(0, 0).filter({ hasText: "First" }),
  ).toBeVisible();
  await expect(
    scrapList.getListItem(1, 0).filter({ hasText: "Second" }),
  ).toBeVisible();
  await expect(
    scrapList.getListItem(2, 0).filter({ hasText: "Third" }),
  ).toBeVisible();

  await page.keyboard.press("Control+Alt+Backspace");

  await expect(
    scrapList.getListItem(2, 0).filter({ hasText: "Third" }),
  ).toBeHidden();

  await page.keyboard.press("Control+Alt+ArrowRight");

  await expect(
    scrapList.getListItem(1, 1).filter({ hasText: "Second" }),
  ).toBeVisible();

  await page.keyboard.press("Enter");
  await page.keyboard.type("Second too");

  await expect(
    scrapList.getListItem(2, 1).filter({ hasText: "Second too" }),
  ).toBeVisible();

  await page.keyboard.press("Control+Alt+ArrowUp");

  await expect(
    scrapList.getListItem(1, 1).filter({ hasText: "Second too" }),
  ).toBeVisible();

  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Control+Space");

  await expect(
    scrapList
      .getListItem(0, 0)
      .filter({ hasText: "First" })
      .getByRole("checkbox"),
  ).toBeChecked();
});

async function triggerFocusEvent(page: Page) {
  await page.evaluate(() => {
    window.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("focus"));
  });
}
