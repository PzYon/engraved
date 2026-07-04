import { expect, Page } from "@playwright/test";
import { test } from "../src/fixtures";
import { TestData } from "../src/api/testData";
import { addNewJournal } from "../src/utils/addNewJournal";
import { login } from "../src/utils/login";
import { ScrapsJournalPage } from "../src/poms/scrapsJournalPage";
import { ScrapListComponent } from "../src/poms/scrapListComponent";
import { isAndroidTest } from "../src/utils/isAndroidTest";

const firstItemText = "My First Item";
const secondItemText = "My Second Item";
const thirdItemText = "My Third Item";

async function openScrapsJournal(
  page: Page,
  testData: TestData,
  name = "My Scraps Journal",
): Promise<ScrapsJournalPage> {
  const { journals } = await testData.seed({
    journals: [{ name, type: "Scraps" }],
  });
  await page.goto(`/journals/details/${journals[0].journalId}`);
  return new ScrapsJournalPage(page);
}

test("add scrap journal, add list entry and add/delete/modify", async ({
  page,
  testData,
}) => {
  const scrapsJournalPage = await openScrapsJournal(page, testData);
  await scrapsJournalPage.expectIsEmpty();

  const scrapList = await scrapsJournalPage.addList();
  await scrapList.typeTitle("This is my title");
  await scrapList.typeListItem(firstItemText);
  await scrapList.addListItem(secondItemText);

  await scrapList.clickSave();

  await scrapList.dblClickToEdit();

  await (await scrapList.getListItemByText(secondItemText))
    .getByLabel("Delete")
    .click();

  await (await scrapList.getListItemByText(firstItemText))
    .getByRole("checkbox")
    .check();

  await scrapList.clickSave(true);
});

test("add scrap journal, add list entries and mark as checked in non-edit mode", async ({
  page,
  testData,
}) => {
  const scrapsJournalPage = await openScrapsJournal(page, testData);
  await scrapsJournalPage.expectIsEmpty();

  const scrapList = await scrapsJournalPage.addList();
  await scrapList.typeTitle("This is my title");
  await scrapList.typeListItem(firstItemText);
  await scrapList.addListItem(secondItemText);
  await scrapList.clickSave();

  await (await scrapList.getListItemByText(firstItemText))
    .getByRole("checkbox")
    .check();

  await expect(
    (await scrapList.getListItemByText(firstItemText)).getByRole("checkbox"),
  ).toBeChecked();

  await page.reload();

  await expect(
    (await scrapList.getListItemByText(firstItemText)).getByRole("checkbox"),
  ).toBeChecked();

  await expect(
    (await scrapList.getListItemByText(secondItemText)).getByRole("checkbox"),
  ).not.toBeChecked();

  await testThatEveryUpdateLeadsToNewInitialState(page, scrapList);
});

test("auto-saves list changes when focus leaves the scrap", async ({
  page,
  testData,
}) => {
  const scrapsJournalPage = await openScrapsJournal(page, testData);
  await scrapsJournalPage.expectIsEmpty();

  const scrapList = await scrapsJournalPage.addList();
  await scrapList.typeTitle("This is my title");
  await scrapList.typeListItem(firstItemText);
  await scrapList.clickSave();

  // edit the existing scrap and add a new item, but do NOT click save:
  // moving focus out of the scrap should auto-save the pending change.
  await scrapList.dblClickToEdit();
  await page.getByLabel("Add new").click();
  await page.keyboard.type(secondItemText);

  await scrapList.blurToAutoSave(true);

  // auto-save must NOT leave edit mode - the user stays in the editor until
  // they explicitly save. The "Save" action is only present while editing.
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeVisible();

  // the change is persisted: after a reload the new item is still there.
  await page.reload();

  await expect(await scrapList.getListItemByText(secondItemText)).toBeVisible();
});

test("does not auto-save when auto-save is disabled for the scrap", async ({
  page,
  testData,
}) => {
  const scrapsJournalPage = await openScrapsJournal(page, testData);
  await scrapsJournalPage.expectIsEmpty();

  const scrapList = await scrapsJournalPage.addList();
  await scrapList.typeTitle("This is my title");
  await scrapList.typeListItem(firstItemText);
  await scrapList.clickSave();

  await scrapList.dblClickToEdit();

  // turn auto-save off for this scrap, then add an item and click outside.
  await page.getByRole("button", { name: "Auto-save is on" }).click();
  await page.getByLabel("Add new").click();
  await page.keyboard.type(secondItemText);
  await page.getByTestId("page-title").click();

  // we are still editing (clicking outside did not close the editor)...
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeVisible();

  // ...and nothing was persisted: the unsaved item is gone after a reload,
  // while the originally saved item remains.
  await page.reload();
  await expect(await scrapList.getListItemByText(secondItemText)).toBeHidden();
  await expect(await scrapList.getListItemByText(firstItemText)).toBeVisible();
});

test("Enter only adds one empty line", async ({ page, testData }) => {
  const scrapsJournalPage = await openScrapsJournal(page, testData);
  await scrapsJournalPage.expectIsEmpty();

  const scrapList = await scrapsJournalPage.addList();
  await scrapList.typeTitle("This is my title");

  await scrapList.typeListItem("First");
  expect(await scrapList.getItemCount()).toBe(1);

  await scrapList.clickSave(false);
  await scrapList.dblClickToEdit();
  await scrapList.selectItem(0);

  await page.keyboard.press("Enter");
  expect(await scrapList.getItemCount()).toBe(2);

  await page.keyboard.press("Enter");
  expect(await scrapList.getItemCount()).toBe(2);
});

test("deleting all checked items keeps one empty line, which is not persisted", async ({
  page,
  testData,
}) => {
  const scrapsJournalPage = await openScrapsJournal(page, testData);
  await scrapsJournalPage.expectIsEmpty();

  const scrapList = await scrapsJournalPage.addList();
  await scrapList.typeTitle("This is my title");
  await scrapList.typeListItem(firstItemText);
  await scrapList.clickSave();

  await scrapList.dblClickToEdit();

  // check the only item and delete all checked items - the list must not end up
  // empty, a single blank line has to remain so there is something to type into.
  await (await scrapList.getListItemByText(firstItemText))
    .getByRole("checkbox")
    .check();

  await page.getByLabel("Delete checked").click();

  expect(await scrapList.getItemCount()).toBe(1);
  await expect(await scrapList.getListItemByText(firstItemText)).toHaveCount(0);

  // saving the lone blank line must not persist it: after a reload no items are
  // shown.
  await scrapList.clickSave(true);
  await page.reload();

  await expect(page.getByText("No items yet.")).toBeVisible();
  expect(await scrapList.getItemCount()).toBe(0);
});

test("Backspace on empty item removes item", async ({ page, testData }) => {
  const scrapsJournalPage = await openScrapsJournal(page, testData);
  await scrapsJournalPage.expectIsEmpty();

  const scrapList = await scrapsJournalPage.addList();
  await scrapList.typeTitle("This is my title");
  await scrapList.typeListItem("ABC");
  await scrapList.addListItem("DEF");

  await scrapList.clickSave();
  await scrapList.dblClickToEdit();

  await scrapList.selectItem(1);

  expect(await scrapList.getItemCount()).toBe(2);

  await scrapList.addListItem("GHI");

  await pressBackspace(page);
  await pressBackspace(page);
  await pressBackspace(page);

  await expect(
    scrapList.getListItem(2, 0).filter({ hasText: "" }),
  ).toBeVisible();
  expect(await scrapList.getItemCount()).toBe(3);

  await pressBackspace(page);

  expect(await scrapList.getItemCount()).toBe(2);
  await expect(scrapList.getListItem(1, 0)).toHaveText("DEF");

  await scrapList.addListItem("GHI");

  expect(await scrapList.getItemCount()).toBe(3);

  await scrapList.selectItem(1);

  await pressBackspace(page);
  await pressBackspace(page);
  await pressBackspace(page);

  expect(await scrapList.getItemCount()).toBe(3);

  await pressBackspace(page);

  expect(await scrapList.getItemCount()).toBe(2);

  await pressBackspace(page);

  await expect(scrapList.getListItem(0, 0)).toHaveText("AB");
  await expect(scrapList.getListItem(1, 0)).toHaveText("GHI");
});

async function pressBackspace(page: Page) {
  await page.keyboard.press("Backspace");
}

// This test drives its own browser context/pages, so it logs in those pages
// explicitly via login() rather than relying on the single-page fixtures.
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
  await scrapListTab1.typeListItem(firstItemText);
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
  await triggerFocusEvent(pageTab1);

  /* eslint-disable playwright/no-conditional-in-test */
  if (isAndroidTest()) {
    await scrapListTab1.clickToExpand();
  }

  await expect(
    await scrapListTab1.getListItemByText(thirdItemText),
  ).toBeVisible();

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
    await scrapListTab1.getListItemByText("Will be saved item"),
  ).toBeVisible();
});

test("perform common scrap list operations using shortcuts", async ({
  page,
  testData,
}) => {
  const scrapsJournalPage = await openScrapsJournal(page, testData);
  await scrapsJournalPage.expectIsEmpty();

  const scrapList = await scrapsJournalPage.addList();
  await scrapList.typeTitle("My Scraps");
  await scrapList.typeListItem("First");
  await scrapList.clickSave(false);

  await scrapList.dblClickToEdit();

  // this should not be necessary, as basically the cursor should already
  // be there. at least i guess so!?
  await scrapList.selectItem(0);

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

async function testThatEveryUpdateLeadsToNewInitialState(
  page: Page,
  scrapList: ScrapListComponent,
) {
  await expect(
    (await scrapList.getListItemByText(firstItemText)).getByRole("checkbox"),
  ).toBeChecked();

  await (await scrapList.getListItemByText(firstItemText))
    .getByRole("checkbox")
    .uncheck();

  await expect(
    (await scrapList.getListItemByText(firstItemText)).getByRole("checkbox"),
  ).not.toBeChecked();

  await (await scrapList.getListItemByText(firstItemText))
    .getByRole("checkbox")
    .check();

  await page.reload();

  await expect(
    (await scrapList.getListItemByText(firstItemText)).getByRole("checkbox"),
  ).toBeChecked();
}
