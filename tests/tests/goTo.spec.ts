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
  await addNewJournal(page, "Scraps", "List of QBs");

  const scrapsJournalPage = new ScrapsJournalPage(page);
  await scrapsJournalPage.addMarkdownWithTitle("QB 1: Pat Mahomes");
  await scrapsJournalPage.addMarkdownWithTitle("QB 2: Josh Allen");

  const goToPage = await scrapsJournalPage.navigateToGoToPage();
  await goToPage.typeText("qb");

  await goToPage.expectNumberOfItems(3);

  await goToPage.arrowDown();
  await goToPage.selectCurrent();

  await scrapsJournalPage.expectPageTitle("List of QBs");
});

test("initially shows recent journals, navigates with click", async ({
  page,
}) => {
  await addNewJournal(page, "Scraps", "Kansas City Chiefs");
  await addNewJournal(page, "Scraps", "Buffalo Bills");
  await addNewJournal(page, "Scraps", "Philadelphia Eagles");
  await addNewJournal(page, "Scraps", "Cincinnati Bengals");

  const scrapsJournalPage = new ScrapsJournalPage(page);
  const goToPage = await scrapsJournalPage.navigateToGoToPage();

  await goToPage.expectNumberOfItems(4);
  await goToPage.expectItemText(0, "Cincinnati Bengals");
  await goToPage.expectItemText(1, "Philadelphia Eagles");
  await goToPage.expectItemText(2, "Buffalo Bills");
  await goToPage.expectItemText(3, "Kansas City Chiefs");
});
