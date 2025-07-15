import { test } from "@playwright/test";
import { login } from "../src/utils/login";
import { addNewJournal } from "../src/utils/addNewJournal";
import { ScrapsJournalPage } from "../src/poms/scrapsJournalPage";

test.beforeEach(async ({ page }) => {
  await login(page, "goto");
});

test("search in go to, use cursor down, use enter to navigate to scrap", async ({
  page,
}) => {
  // todo: would expect scrap, but returns a metric hardcoded
  await addNewJournal(page, "Scraps", "List of QBs");

  const scrapsJournalPage = new ScrapsJournalPage(page);
  await scrapsJournalPage.addMarkdownWithTitle("QB 1: Pat Mahomes");
  await scrapsJournalPage.addMarkdownWithTitle("QB 2: Josh Allen");

  const goToPage = await scrapsJournalPage.navigateToGoToPage();
  await goToPage.typeText("q");
  await goToPage.typeText("qb");

  // wait for debounce
  await page.waitForTimeout(1000);

  await goToPage.arrowDown();
  await goToPage.selectCurrent();

  await page.waitForTimeout(1000);

  await scrapsJournalPage.expectPageTitle("List of QBs");
});
