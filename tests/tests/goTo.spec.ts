import { test } from "../src/fixtures";
import { addNewJournal } from "../src/utils/addNewJournal";
import { navigateToHome } from "../src/utils/navigateTo";
import { ScrapsJournalPage } from "../src/poms/scrapsJournalPage";

test("search in go to, use cursor down, use enter to navigate to scrap", async ({
  page,
  testData,
}) => {
  const { journals } = await testData.seed({
    journals: [{ name: "List of QBs", type: "Scraps" }],
  });
  await page.goto(`/journals/details/${journals[0].journalId}`);

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
  await navigateToHome(page);

  await addNewJournal(page, "Scraps", "Buffalo Bills");
  await navigateToHome(page);
  await addNewJournal(page, "Scraps", "Philadelphia Eagles");
  await navigateToHome(page);
  await addNewJournal(page, "Scraps", "Cincinnati Bengals");
  await navigateToHome(page);

  const scrapsJournalPage = new ScrapsJournalPage(page);
  let goToPage = await scrapsJournalPage.navigateToGoToPage();

  await goToPage.expectNumberOfItems(4);
  await goToPage.expectItemText(0, "Cincinnati Bengals");
  await goToPage.expectItemText(1, "Philadelphia Eagles");
  await goToPage.expectItemText(2, "Buffalo Bills");
  await goToPage.expectItemText(3, "Kansas City Chiefs");

  await goToPage.clickItem(2);
  await scrapsJournalPage.expectPageTitle("Buffalo Bills");

  goToPage = await scrapsJournalPage.navigateToGoToPage();

  await goToPage.expectNumberOfItems(4);
  await goToPage.expectItemText(0, "Buffalo Bills");
  await goToPage.expectItemText(1, "Cincinnati Bengals");
  await goToPage.expectItemText(2, "Philadelphia Eagles");
  await goToPage.expectItemText(3, "Kansas City Chiefs");
});
